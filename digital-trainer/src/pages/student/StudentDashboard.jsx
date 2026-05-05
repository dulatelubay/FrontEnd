// src/pages/student/StudentDashboard.jsx
// Главная страница ученика — личный прогресс и задания

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'

// ─── Данные ученика ───────────────────────────────────────────────────────────

const myTasks = [
    { id: 1, title: 'Найти максимум в списке',    topic: 'Алгоритмы',    status: 'graded',  grade: 95, dueDate: '20 апр' },
    { id: 2, title: 'Определить тип переменной',  topic: 'Типы данных',  status: 'graded',  grade: 80, dueDate: '22 апр' },
    { id: 3, title: 'Подсчёт чётных чисел',       topic: 'Циклы',        status: 'pending', grade: null, dueDate: '25 апр' },
    { id: 4, title: 'Калькулятор с функциями',    topic: 'Функции',      status: 'new',     grade: null, dueDate: '28 апр' },
    { id: 5, title: 'Разворот списка',            topic: 'Списки',       status: 'new',     grade: null, dueDate: '02 май' },
]

const myTopics = [
    { name: 'Алгоритмы',      done: true,  score: 95 },
    { name: 'Типы данных',    done: true,  score: 80 },
    { name: 'Условия/циклы',  done: true,  score: 88 },
    { name: 'Функции',        done: false, score: null },
    { name: 'Списки',         done: false, score: null },
    { name: 'ООП',            done: false, score: null },
]

const recentActivity = [
    { icon: '✅', text: 'Сдали задание "Найти максимум"',     time: '2 часа назад',  color: '#48BB78' },
    { icon: '📖', text: 'Изучили тему "Условия и циклы"',    time: 'Вчера',         color: '#1A6EFF' },
    { icon: '💻', text: 'Открыли сессию Google Colab',       time: 'Вчера',         color: '#F9AB00' },
    { icon: '🎯', text: 'Получили оценку 80 за типы данных', time: '3 дня назад',   color: '#9B7FE8' },
]

// ─── Утилиты ──────────────────────────────────────────────────────────────────

function getStatusStyle(status, isDark) {
    const map = {
        graded:  { bg: isDark ? '#1A3A2A' : '#E6FFEE', color: isDark ? '#A6E3A1' : '#276749', label: 'Проверено' },
        pending: { bg: isDark ? '#3A2E10' : '#FFFBEB', color: isDark ? '#F9E2AF' : '#975A16', label: 'На проверке' },
        new:     { bg: isDark ? '#1E3A5F' : '#EBF4FF', color: isDark ? '#89B4FA' : '#1A6EFF', label: 'Новое' },
    }
    return map[status]
}

function getScoreColor(score, isDark) {
    if (!score) return isDark ? '#6C7086' : '#A0AEC0'
    if (score >= 80) return isDark ? '#A6E3A1' : '#276749'
    if (score >= 60) return isDark ? '#F9E2AF' : '#975A16'
    return isDark ? '#F28B82' : '#C53030'
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function StudentDashboard() {
    const { theme } = useTheme()
    const { user } = useAuth()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const completedTopics = myTopics.filter(t => t.done).length
    const completedTasks  = myTasks.filter(t => t.status === 'graded').length
    const avgScore = Math.round(
        myTasks.filter(t => t.grade).reduce((s, t) => s + t.grade, 0) /
        myTasks.filter(t => t.grade).length
    )
    const newTasksCount = myTasks.filter(t => t.status === 'new').length

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
                            {newTasksCount > 0
                                ? `У тебя ${newTasksCount} новых задания. Удачи!`
                                : 'Все задания выполнены. Отличная работа!'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>{avgScore}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>средний балл</div>
                    </div>
                </div>

                {/* Стат карточки */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12, marginBottom: 20,
                }}>
                    {[
                        { icon: '📖', label: 'Тем изучено',   value: `${completedTopics}/${myTopics.length}` },
                        { icon: '✅', label: 'Задач сдано',    value: `${completedTasks}/${myTasks.length}` },
                        { icon: '🎯', label: 'Средний балл',   value: avgScore },
                        { icon: '💻', label: 'Сессий Colab',   value: 9 },
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
                            {myTasks.slice(0, 4).map(task => {
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
                                            {task.grade && (
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
                  {completedTopics}/{myTopics.length} тем
                </span>
                            </div>
                            <div style={{ height: 7, borderRadius: 10, background: t.border }}>
                                <div style={{
                                    height: 7, borderRadius: 10, background: accent,
                                    width: `${(completedTopics / myTopics.length) * 100}%`,
                                    transition: 'width 0.4s',
                                }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {myTopics.map((topic, i) => (
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
                </div>

            </div>
        </div>
    )
}