// src/pages/student/StudentDashboard.jsx
// Главная страница ученика — личный прогресс и задания
// Все данные подтягиваются из бэка; у нового ученика без сабмишенов
// метрики обнуляются, а курс/темы/задания всё равно отображаются.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'

// ─── Утилиты ──────────────────────────────────────────────────────────────────

function getStatusStyle(status, isDark) {
    const map = {
        graded:    { bg: isDark ? '#1A3A2A' : '#E6FFEE', color: isDark ? '#A6E3A1' : '#276749', label: 'Проверено' },
        ai_graded: { bg: isDark ? '#2A1F3F' : '#F0E6FF', color: isDark ? '#CBA6F7' : '#6B4FC8', label: 'Оценено ИИ' },
        pending:   { bg: isDark ? '#3A2E10' : '#FFFBEB', color: isDark ? '#F9E2AF' : '#975A16', label: 'На проверке' },
        new:       { bg: isDark ? '#1E3A5F' : '#EBF4FF', color: isDark ? '#89B4FA' : '#1A6EFF', label: 'Новое' },
    }
    return map[status] || map.new
}

function getScoreColor(score, isDark) {
    if (score == null) return isDark ? '#6C7086' : '#A0AEC0'
    if (score >= 80) return isDark ? '#A6E3A1' : '#276749'
    if (score >= 60) return isDark ? '#F9E2AF' : '#975A16'
    return isDark ? '#F28B82' : '#C53030'
}

function timeAgo(iso) {
    if (!iso) return ''
    const diffMs = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'только что'
    if (mins < 60) return `${mins} мин назад`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} ч назад`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'вчера'
    if (days < 7) return `${days} д назад`
    return new Date(iso).toLocaleDateString('ru-RU')
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function StudentDashboard() {
    const { theme } = useTheme()
    const { user, authFetch } = useAuth()
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
                if (!cancelled) setError('Не удалось загрузить данные')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [authFetch])

    // ─── Производные данные ──────────────────────────────────────────────────

    // Последний сабмишен на каждый task — определяет статус и оценку задания.
    const latestSubmissionByTask = new Map()
    for (const s of submissions) {
        const existing = latestSubmissionByTask.get(s.taskId)
        if (!existing || new Date(s.submittedAt) > new Date(existing.submittedAt)) {
            latestSubmissionByTask.set(s.taskId, s)
        }
    }

    const myTasks = tasks.map(task => {
        const sub = latestSubmissionByTask.get(task.id)
        const grade = sub ? (sub.grade != null ? sub.grade : sub.aiGrade) : null
        return {
            id: task.id,
            title: task.title,
            topic: task.topic || '',
            topicId: task.topicId,
            status: sub ? sub.status : 'new',
            grade,
        }
    })

    const completedTasks = myTasks.filter(t => t.grade != null).length
    const newTasksCount = myTasks.filter(t => t.status === 'new').length

    const scoredTasks = myTasks.filter(t => t.grade != null)
    const avgScore = scoredTasks.length === 0
        ? 0
        : Math.round(scoredTasks.reduce((s, t) => s + t.grade, 0) / scoredTasks.length)

    // По темам — берём для каждой темы лучший балл из задач этой темы.
    const myTopics = topics.map(topic => {
        const scoresForTopic = myTasks
            .filter(task => (task.topicId === topic.id || task.topic === topic.title) && task.grade != null)
            .map(task => task.grade)
        const score = scoresForTopic.length > 0 ? Math.max(...scoresForTopic) : null
        return { name: topic.title, done: score != null, score }
    })
    const completedTopics = myTopics.filter(t => t.done).length

    // Последние сабмишены — для блока активности.
    const recentActivity = [...submissions]
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 4)
        .map(s => ({
            icon: s.status === 'graded' || s.status === 'ai_graded' ? '✅' : '📝',
            text: `Отправили решение «${s.taskTitle}»`,
            time: timeAgo(s.submittedAt),
            color: s.status === 'graded' || s.status === 'ai_graded' ? '#48BB78' : '#F9AB00',
        }))

    const firstName = user?.name?.split(' ')[0] || 'Ученик'

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Topbar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>Мой кабинет</div>
                <ThemeToggle />
            </div>

            <div style={{ padding: '22px 24px' }}>

                {/* Welcome */}
                <div style={{
                    background: `linear-gradient(135deg, ${accent}, ${isDark ? '#5B9BFF' : '#4A9EFF'})`,
                    borderRadius: 14, padding: '20px 24px',
                    marginBottom: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                            Привет, {firstName}! 👋
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                            {loading
                                ? 'Загружаем твой прогресс…'
                                : tasks.length === 0
                                    ? 'Заданий пока нет. Загляни в курсы.'
                                    : newTasksCount > 0
                                        ? `У тебя ${newTasksCount} ${newTasksCount === 1 ? 'новое задание' : 'новых заданий'}. Удачи!`
                                        : 'Все задания выполнены. Отличная работа!'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>
                            {scoredTasks.length > 0 ? avgScore : '—'}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>средний балл</div>
                    </div>
                </div>

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
                        { icon: '📖', label: 'Тем изучено',   value: `${completedTopics}/${myTopics.length || 0}` },
                        { icon: '✅', label: 'Задач сдано',    value: `${completedTasks}/${myTasks.length || 0}` },
                        { icon: '🎯', label: 'Средний балл',   value: scoredTasks.length > 0 ? avgScore : '—' },
                        { icon: '💻', label: 'Сессий Colab',   value: 0 },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: isDark ? '#181926' : '#fff',
                            border: `1px solid ${t.border}`,
                            borderRadius: 12, padding: '14px 16px',
                        }}>
                            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                            <div style={{ fontSize: 22, fontWeight: 600, color: t.text }}>{item.value}</div>
                            <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* Два столбца */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

                    {/* Мои задания */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: 16,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Мои задания</div>
                            <Link to="/student/tasks" style={{ fontSize: 12, color: accent, textDecoration: 'none' }}>Все →</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {myTasks.length === 0 ? (
                                <div style={{ fontSize: 12, color: t.textSecondary, padding: '12px 0' }}>
                                    {loading ? 'Загрузка…' : 'Пока нет заданий'}
                                </div>
                            ) : myTasks.slice(0, 4).map(task => {
                                const s = getStatusStyle(task.status, isDark)
                                return (
                                    <div key={task.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '9px 12px',
                                        background: isDark ? '#1E1F2E' : '#F4F6FA',
                                        border: `1px solid ${t.border}`,
                                        borderRadius: 8,
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 2 }}>
                                                {task.title}
                                            </div>
                                            <div style={{ fontSize: 11, color: t.textSecondary }}>{task.topic}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                                            <span style={{
                                                fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 500,
                                                background: s.bg, color: s.color,
                                            }}>{s.label}</span>
                                            {task.grade != null && (
                                                <span style={{ fontSize: 11, fontWeight: 700, color: getScoreColor(task.grade, isDark) }}>
                                                    {task.grade}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Прогресс по темам */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: 16,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Прогресс по темам</div>
                            <Link to="/student/progress" style={{ fontSize: 12, color: accent, textDecoration: 'none' }}>Детали →</Link>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 12, color: t.textSecondary }}>Общий прогресс</span>
                                <span style={{ fontSize: 12, color: accent, fontWeight: 500 }}>
                                    {completedTopics}/{myTopics.length || 0} тем
                                </span>
                            </div>
                            <div style={{ height: 7, borderRadius: 10, background: t.border }}>
                                <div style={{
                                    height: 7, borderRadius: 10, background: accent,
                                    width: myTopics.length > 0 ? `${(completedTopics / myTopics.length) * 100}%` : '0%',
                                    transition: 'width 0.4s',
                                }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {myTopics.length === 0 ? (
                                <div style={{ fontSize: 12, color: t.textSecondary }}>
                                    {loading ? 'Загрузка…' : 'Темы появятся, когда учитель их создаст'}
                                </div>
                            ) : myTopics.map((topic, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 600,
                                        background: topic.done
                                            ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                            : (isDark ? '#313244' : '#F4F6FA'),
                                        color: topic.done
                                            ? (isDark ? '#A6E3A1' : '#276749')
                                            : t.textSecondary,
                                    }}>
                                        {topic.done ? '✓' : i + 1}
                                    </div>
                                    <span style={{
                                        flex: 1, fontSize: 12,
                                        color: topic.done ? t.text : t.textSecondary,
                                    }}>
                                        {topic.name}
                                    </span>
                                    {topic.done ? (
                                        <span style={{
                                            fontSize: 12, fontWeight: 700,
                                            color: getScoreColor(topic.score, isDark),
                                        }}>
                                            {topic.score}
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>—</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Последняя активность */}
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 12, padding: 16,
                }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 14 }}>
                        Последняя активность
                    </div>
                    {recentActivity.length === 0 ? (
                        <div style={{ fontSize: 12, color: t.textSecondary, padding: '4px 0' }}>
                            {loading ? 'Загрузка…' : 'Активности пока нет. Сдай первое задание, и оно появится здесь.'}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {recentActivity.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                        background: item.color + '22',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 16,
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, color: t.text }}>{item.text}</div>
                                    </div>
                                    <div style={{ fontSize: 11, color: t.textSecondary, flexShrink: 0 }}>
                                        {item.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
