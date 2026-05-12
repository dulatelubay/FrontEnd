// src/pages/student/StudentProgress.jsx
// Мой прогресс — личная успеваемость ученика
// Все данные подтягиваются из бэка; у нового ученика без сабмишенов
// средний балл, оценки и активность пустые — но темы видны.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'

// ─── Утилиты ──────────────────────────────────────────────────────────────────

function getScoreColor(score, isDark) {
    if (score >= 80) return isDark ? '#A6E3A1' : '#276749'
    if (score >= 60) return isDark ? '#F9E2AF' : '#975A16'
    return isDark ? '#F28B82' : '#C53030'
}

function getScoreBg(score, isDark) {
    if (score >= 80) return isDark ? '#1A3A2A' : '#E6FFEE'
    if (score >= 60) return isDark ? '#3A2E10' : '#FFFBEB'
    return isDark ? '#2E1A1A' : '#FFF5F5'
}

function formatShortDate(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// Понедельник как начало недели
function buildWeekActivity(submissions) {
    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const counts = [0, 0, 0, 0, 0, 0, 0]
    const now = new Date()
    const monday = new Date(now)
    const dow = (monday.getDay() + 6) % 7 // 0=Mon
    monday.setDate(monday.getDate() - dow)
    monday.setHours(0, 0, 0, 0)

    for (const s of submissions) {
        const submitted = new Date(s.submittedAt)
        if (submitted < monday) continue
        const dayIdx = Math.floor((submitted - monday) / (24 * 3600 * 1000))
        if (dayIdx >= 0 && dayIdx < 7) counts[dayIdx]++
    }
    return labels.map((day, i) => ({ day, value: counts[i] }))
}

function CustomTooltip({ active, payload, label, t }) {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 8, padding: '8px 12px', fontSize: 12, color: t.text,
        }}>
            <strong>{label}</strong>: {payload[0].value}
        </div>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function StudentProgress() {
    const { theme } = useTheme()
    const { authFetch } = useAuth()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const [topics, setTopics] = useState([])
    const [tasks, setTasks] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false
        async function load() {
            setLoading(true)
            try {
                const [topicsRes, tasksRes, submissionsRes] = await Promise.all([
                    authFetch('/api/topics'),
                    authFetch('/api/tasks'),
                    authFetch('/api/submissions/my'),
                ])
                if (!topicsRes.ok || !tasksRes.ok || !submissionsRes.ok) {
                    throw new Error('fetch failed')
                }
                const [topicsData, tasksData, submissionsData] = await Promise.all([
                    topicsRes.json(),
                    tasksRes.json(),
                    submissionsRes.json(),
                ])
                if (cancelled) return
                setTopics(topicsData)
                setTasks(tasksData)
                setSubmissions(submissionsData)
                setError('')
            } catch (e) {
                if (!cancelled) setError('Не удалось загрузить прогресс')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [authFetch])

    // ─── Производные данные ──────────────────────────────────────────────────

    // Берём последний сабмишен на каждую задачу для определения оценки.
    const latestSubmissionByTask = new Map()
    for (const s of submissions) {
        const existing = latestSubmissionByTask.get(s.taskId)
        if (!existing || new Date(s.submittedAt) > new Date(existing.submittedAt)) {
            latestSubmissionByTask.set(s.taskId, s)
        }
    }

    // Оценки по сданным задачам — в хронологическом порядке.
    const myGrades = [...latestSubmissionByTask.values()]
        .filter(s => (s.grade != null) || (s.aiGrade != null))
        .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
        .map(s => ({
            task: s.taskTitle,
            score: s.grade != null ? s.grade : s.aiGrade,
            topic: s.topicTitle || '',
            date: formatShortDate(s.submittedAt),
        }))

    const totalTasks = tasks.length

    const myTopics = topics.map(topic => {
        const tasksOfTopic = tasks.filter(task => task.topicId === topic.id || task.topic === topic.title)
        const grades = tasksOfTopic
            .map(task => {
                const sub = latestSubmissionByTask.get(task.id)
                if (!sub) return null
                return sub.grade != null ? sub.grade : sub.aiGrade
            })
            .filter(v => v != null)
        const best = grades.length > 0 ? Math.max(...grades) : null
        return {
            name: topic.title,
            done: best != null,
            score: best,
            tasksCount: tasksOfTopic.length,
        }
    })

    const completedTopics = myTopics.filter(x => x.done).length
    const avgScore = myGrades.length === 0
        ? 0
        : Math.round(myGrades.reduce((s, g) => s + g.score, 0) / myGrades.length)
    const weekActivity = buildWeekActivity(submissions)

    const gridColor = isDark ? '#2A2D3E' : '#E2E8F0'
    const textColor = isDark ? '#6C7086' : '#A0AEC0'

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Topbar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Link to="/student" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>Главная</Link>
                    <span style={{ color: t.textSecondary }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Мой прогресс</span>
                </div>
                <ThemeToggle />
            </div>

            <div style={{ padding: '22px 24px' }}>

                {error && (
                    <div style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: isDark ? '#2E1A1A' : '#FFF5F5',
                        color: isDark ? '#F28B82' : '#C53030',
                        border: `1px solid ${isDark ? '#5A2A2A' : '#FED7D7'}`,
                        fontSize: 13,
                        marginBottom: 16,
                    }}>{error}</div>
                )}

                {/* Стат карточки */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12, marginBottom: 20,
                }}>
                    {[
                        {
                            icon: '🎯',
                            label: 'Средний балл',
                            value: myGrades.length > 0 ? avgScore : '—',
                            sub: myGrades.length === 0
                                ? 'Сдай первое задание'
                                : avgScore >= 80
                                    ? '↑ Отлично!'
                                    : avgScore >= 60 ? 'Хорошо' : 'Нужно постараться',
                            subColor: myGrades.length > 0 ? getScoreColor(avgScore, isDark) : t.textSecondary,
                        },
                        { icon: '📖', label: 'Тем изучено',   value: `${completedTopics}/${myTopics.length || 0}` },
                        { icon: '✅', label: 'Задач сдано',   value: `${myGrades.length}/${totalTasks || 0}` },
                        { icon: '💻', label: 'Сессий Colab',  value: 0 },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: isDark ? '#181926' : '#fff',
                            border: `1px solid ${t.border}`,
                            borderRadius: 12, padding: '16px 18px',
                        }}>
                            <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                            <div style={{ fontSize: 26, fontWeight: 600, color: t.text }}>{item.value}</div>
                            <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>{item.label}</div>
                            {item.sub && (
                                <div style={{ fontSize: 11, color: item.subColor, marginTop: 4, fontWeight: 500 }}>
                                    {item.sub}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Ряд 1: График оценок + активность */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

                    {/* Динамика оценок */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: '18px 20px',
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>
                            Динамика оценок
                        </div>
                        {myGrades.length === 0 ? (
                            <div style={{
                                height: 160,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, color: t.textSecondary, textAlign: 'center',
                            }}>
                                {loading ? 'Загрузка…' : 'Оценки появятся после первого сданного задания'}
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={myGrades}>
                                    <CartesianGrid stroke={gridColor} />
                                    <XAxis dataKey="task" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                                    <Tooltip content={<CustomTooltip t={{ card: isDark ? '#181926' : '#fff', border: t.border, text: t.text }} />} />
                                    <Line
                                        type="monotone" dataKey="score" name="Оценка"
                                        stroke={accent} strokeWidth={2.5}
                                        dot={{ fill: accent, r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Активность за неделю */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: '18px 20px',
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>
                            Активность за неделю
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110, marginBottom: 8 }}>
                            {weekActivity.map((day, i) => {
                                const maxVal = Math.max(1, ...weekActivity.map(d => d.value))
                                return (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                        <div style={{
                                            width: '100%',
                                            height: day.value > 0 ? `${(day.value / maxVal) * 90}px` : '4px',
                                            borderRadius: '4px 4px 0 0',
                                            background: day.value > 0 ? accent : t.border,
                                            opacity: day.value > 0 ? 0.85 : 1,
                                            transition: 'height 0.3s',
                                        }} />
                                        <div style={{ fontSize: 10, color: t.textSecondary }}>{day.day}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ fontSize: 11, color: t.textSecondary, textAlign: 'center' }}>
                            Сабмишенов за каждый день
                        </div>
                    </div>
                </div>

                {/* Оценки по заданиям */}
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 12, padding: '18px 20px',
                    marginBottom: 14,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Мои оценки</div>
                        <Link to="/student/tasks" style={{ fontSize: 12, color: accent, textDecoration: 'none' }}>
                            Все задания →
                        </Link>
                    </div>
                    {myGrades.length === 0 ? (
                        <div style={{ fontSize: 12, color: t.textSecondary, padding: '8px 0' }}>
                            {loading ? 'Загрузка…' : 'Оценок пока нет — отправь первое решение, и оно появится здесь'}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {myGrades.map((g, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '11px 14px',
                                    background: isDark ? '#1E1F2E' : '#F4F6FA',
                                    border: `1px solid ${t.border}`,
                                    borderRadius: 9,
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                        background: getScoreBg(g.score, isDark),
                                        color: getScoreColor(g.score, isDark),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 700,
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{g.task}</div>
                                        <div style={{ fontSize: 11, color: t.textSecondary }}>{g.topic} · {g.date}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 100, height: 6, borderRadius: 10, background: t.border }}>
                                            <div style={{
                                                height: 6, borderRadius: 10,
                                                background: getScoreColor(g.score, isDark),
                                                width: `${g.score}%`,
                                            }} />
                                        </div>
                                        <span style={{
                                            fontSize: 15, fontWeight: 700,
                                            color: getScoreColor(g.score, isDark),
                                            background: getScoreBg(g.score, isDark),
                                            padding: '3px 10px', borderRadius: 8, minWidth: 48, textAlign: 'center',
                                        }}>
                                            {g.score}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Прогресс по темам */}
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 12, padding: '18px 20px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Прогресс по темам</div>
                        <span style={{ fontSize: 12, color: accent }}>
                            {completedTopics}/{myTopics.length || 0} изучено
                        </span>
                    </div>

                    {/* Общий прогресс-бар */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ height: 8, borderRadius: 10, background: t.border }}>
                            <div style={{
                                height: 8, borderRadius: 10, background: accent,
                                width: myTopics.length > 0 ? `${(completedTopics / myTopics.length) * 100}%` : '0%',
                                transition: 'width 0.5s',
                            }} />
                        </div>
                    </div>

                    {myTopics.length === 0 ? (
                        <div style={{ fontSize: 12, color: t.textSecondary }}>
                            {loading ? 'Загрузка…' : 'Темы появятся, когда учитель их создаст'}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {myTopics.map((topic, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 14px',
                                    background: isDark ? '#1E1F2E' : '#F4F6FA',
                                    border: `1px solid ${topic.done ? (isDark ? '#2A5A3A' : '#9AE6B4') : t.border}`,
                                    borderRadius: 9,
                                    opacity: topic.done ? 1 : 0.65,
                                }}>
                                    <div style={{
                                        width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700,
                                        background: topic.done
                                            ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                            : (isDark ? '#313244' : '#E2E8F0'),
                                        color: topic.done
                                            ? (isDark ? '#A6E3A1' : '#276749')
                                            : t.textSecondary,
                                    }}>
                                        {topic.done ? '✓' : i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, color: t.text }}>{topic.name}</div>
                                        <div style={{ fontSize: 11, color: t.textSecondary }}>
                                            {topic.tasksCount > 0 ? `${topic.tasksCount} задач` : 'без заданий'}
                                        </div>
                                    </div>
                                    {topic.done ? (
                                        <span style={{
                                            fontSize: 13, fontWeight: 700,
                                            color: getScoreColor(topic.score, isDark),
                                            background: getScoreBg(topic.score, isDark),
                                            padding: '3px 10px', borderRadius: 7,
                                        }}>
                                            {topic.score}
                                        </span>
                                    ) : (
                                        <Link to="/student/theory" style={{
                                            fontSize: 11, padding: '4px 12px', borderRadius: 7,
                                            background: isDark ? '#1E3A5F' : '#EBF4FF',
                                            color: accent, textDecoration: 'none',
                                            fontWeight: 500,
                                        }}>
                                            Изучить →
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
