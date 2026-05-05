// src/pages/student/StudentProgress.jsx
// Мой прогресс — личная успеваемость ученика

import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'

// ─── Данные ──────────────────────────────────────────────────────────────────

const myGrades = [
    { task: 'Задание 1', score: 95, topic: 'Алгоритмы',     date: '20 апр' },
    { task: 'Задание 2', score: 80, topic: 'Типы данных',    date: '22 апр' },
    { task: 'Задание 3', score: 88, topic: 'Циклы',          date: '24 апр' },
]

const myTopics = [
    { name: 'Алгоритмы',      done: true,  score: 95, time: '10 мин' },
    { name: 'Типы данных',    done: true,  score: 80, time: '8 мин'  },
    { name: 'Условия/циклы',  done: true,  score: 88, time: '15 мин' },
    { name: 'Функции',        done: false, score: null, time: '12 мин' },
    { name: 'Списки',         done: false, score: null, time: '14 мин' },
    { name: 'ООП',            done: false, score: null, time: '20 мин' },
    { name: 'Рекурсия',       done: false, score: null, time: '18 мин' },
    { name: 'Сортировки',     done: false, score: null, time: '22 мин' },
]

const weekActivity = [
    { day: 'Пн', value: 1 },
    { day: 'Вт', value: 3 },
    { day: 'Ср', value: 2 },
    { day: 'Чт', value: 4 },
    { day: 'Пт', value: 2 },
    { day: 'Сб', value: 1 },
    { day: 'Вс', value: 0 },
]

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
    const { user }  = useAuth()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const completedTopics = myTopics.filter(t => t.done).length
    const avgScore = Math.round(
        myGrades.reduce((s, g) => s + g.score, 0) / myGrades.length
    )
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

                {/* Стат карточки */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12, marginBottom: 20,
                }}>
                    {[
                        { icon: '🎯', label: 'Средний балл',  value: avgScore,
                            sub: avgScore >= 80 ? '↑ Отлично!' : avgScore >= 60 ? 'Хорошо' : 'Нужно постараться',
                            subColor: getScoreColor(avgScore, isDark) },
                        { icon: '📖', label: 'Тем изучено',   value: `${completedTopics}/${myTopics.length}` },
                        { icon: '✅', label: 'Задач сдано',   value: `${myGrades.length}/5` },
                        { icon: '💻', label: 'Сессий Colab',  value: 9 },
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
                            {weekActivity.map((day, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{
                                        width: '100%',
                                        height: day.value > 0 ? `${(day.value / 4) * 90}px` : '4px',
                                        borderRadius: '4px 4px 0 0',
                                        background: day.value > 0 ? accent : t.border,
                                        opacity: day.value > 0 ? 0.85 : 1,
                                        transition: 'height 0.3s',
                                    }} />
                                    <div style={{ fontSize: 10, color: t.textSecondary }}>{day.day}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 11, color: t.textSecondary, textAlign: 'center' }}>
                            Действий за каждый день
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
              {completedTopics}/{myTopics.length} изучено
            </span>
                    </div>

                    {/* Общий прогресс-бар */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ height: 8, borderRadius: 10, background: t.border }}>
                            <div style={{
                                height: 8, borderRadius: 10, background: accent,
                                width: `${(completedTopics / myTopics.length) * 100}%`,
                                transition: 'width 0.5s',
                            }} />
                        </div>
                    </div>

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
                                    <div style={{ fontSize: 11, color: t.textSecondary }}>⏱ {topic.time}</div>
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
                </div>

            </div>
        </div>
    )
}