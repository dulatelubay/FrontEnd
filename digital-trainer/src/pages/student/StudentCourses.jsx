// src/pages/student/StudentCourses.jsx
// Course list page for students

import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'
import { COURSES, readProgress, countCompletedModules } from '../../data/courseData'

export default function StudentCourses() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'
    const { user } = useAuth()

    const progress = readProgress(user?.id)

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Link to="/student" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>
                        Главная
                    </Link>
                    <span style={{ color: t.textSecondary, fontSize: 12 }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Курсы</span>
                </div>
                <ThemeToggle />
            </div>

            {/* Content */}
            <div style={{ padding: '28px 28px', maxWidth: 860, width: '100%', boxSizing: 'border-box' }}>
                <h1 style={{ margin: '0 0 6px', color: t.text, fontSize: 26, fontWeight: 650 }}>
                    Курсы обучения
                </h1>
                <p style={{ margin: '0 0 24px', color: t.textSecondary, fontSize: 14 }}>
                    Пройдите курсы от основ работы с данными до продвинутой аналитики.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {COURSES.map(course => {
                        const totalModules = course.modules.length
                        const completed = countCompletedModules(progress, course.id, course.modules)
                        const pct = totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0
                        const started = completed > 0

                        return (
                            <Link
                                key={course.id}
                                to={`/student/courses/${course.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={{
                                    background: isDark ? '#181926' : '#fff',
                                    border: `1px solid ${t.border}`,
                                    borderRadius: 12,
                                    padding: '22px 24px',
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.15s, border-color 0.15s',
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.boxShadow = `0 4px 20px ${accent}22`
                                        e.currentTarget.style.borderColor = accent
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.boxShadow = 'none'
                                        e.currentTarget.style.borderColor = t.border
                                    }}
                                >
                                    {/* Title row */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                <span style={{ fontSize: 22 }}>🎓</span>
                                                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: t.text }}>
                                                    {course.title}
                                                </h2>
                                            </div>
                                            <p style={{ margin: 0, fontSize: 13, color: t.textSecondary, lineHeight: 1.6 }}>
                                                {course.description}
                                            </p>
                                        </div>
                                        <div style={{ flexShrink: 0 }}>
                                            {completed === totalModules ? (
                                                <span style={{
                                                    fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500,
                                                    background: isDark ? '#1A3A2A' : '#E6FFEE',
                                                    color: isDark ? '#A6E3A1' : '#276749',
                                                }}>
                                                    Завершён
                                                </span>
                                            ) : started ? (
                                                <span style={{
                                                    fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500,
                                                    background: isDark ? '#1E3A5F' : '#EBF4FF',
                                                    color: isDark ? '#89B4FA' : '#1A6EFF',
                                                }}>
                                                    В процессе
                                                </span>
                                            ) : (
                                                <span style={{
                                                    fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500,
                                                    background: isDark ? '#2A2D3E' : '#F4F6FA',
                                                    color: t.textSecondary,
                                                }}>
                                                    Не начат
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                                        <span style={{ fontSize: 12, color: t.textSecondary }}>
                                            {totalModules} {totalModules === 1 ? 'модуль' : totalModules < 5 ? 'модуля' : 'модулей'}
                                        </span>
                                        <span style={{ fontSize: 12, color: t.textSecondary }}>·</span>
                                        <span style={{ fontSize: 12, color: t.textSecondary }}>
                                            {completed} из {totalModules} завершено
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div style={{ background: isDark ? '#2A2D3E' : '#E2E8F0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${pct}%`,
                                            height: '100%',
                                            background: pct === 100
                                                ? (isDark ? '#A6E3A1' : '#38A169')
                                                : accent,
                                            borderRadius: 99,
                                            transition: 'width 0.4s ease',
                                        }} />
                                    </div>
                                    <div style={{ marginTop: 6, fontSize: 11, color: t.textSecondary, textAlign: 'right' }}>
                                        {pct}%
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
