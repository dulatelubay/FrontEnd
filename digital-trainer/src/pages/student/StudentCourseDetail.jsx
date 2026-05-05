// src/pages/student/StudentCourseDetail.jsx
// Module list with progress for a specific course

import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'
import {
    COURSES,
    readProgress,
    getModuleProgress,
    isModuleLocked,
} from '../../data/courseData'

export default function StudentCourseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'
    const { user } = useAuth()

    const course = COURSES.find(c => c.id === id)

    if (!course) {
        return (
            <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: t.textSecondary }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>404</div>
                    <div style={{ fontSize: 14, marginBottom: 16 }}>Курс не найден</div>
                    <Link to="/student/courses" style={{ color: accent, fontSize: 13 }}>Вернуться к курсам</Link>
                </div>
            </div>
        )
    }

    const progress = readProgress(user?.id)

    function handleModuleClick(moduleIndex) {
        const locked = isModuleLocked(progress, course.id, course.modules, moduleIndex)
        if (locked) return
        const module = course.modules[moduleIndex]
        navigate(`/student/courses/${course.id}/module/${module.id}`)
    }

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
                    <Link to="/student/courses" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>
                        Курсы
                    </Link>
                    <span style={{ color: t.textSecondary, fontSize: 12 }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{course.title}</span>
                </div>
                <ThemeToggle />
            </div>

            {/* Content */}
            <div style={{ padding: '28px 28px', maxWidth: 860, width: '100%', boxSizing: 'border-box' }}>

                {/* Course header */}
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 12,
                    padding: '22px 24px',
                    marginBottom: 24,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <span style={{ fontSize: 28 }}>🎓</span>
                        <h1 style={{ margin: 0, fontSize: 21, fontWeight: 650, color: t.text }}>
                            {course.title}
                        </h1>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: t.textSecondary, lineHeight: 1.65 }}>
                        {course.description}
                    </p>
                </div>

                {/* Module list */}
                <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600, color: t.text }}>
                    Модули курса
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {course.modules.map((module, idx) => {
                        const locked = isModuleLocked(progress, course.id, course.modules, idx)
                        const mp = getModuleProgress(progress, course.id, module.id)
                        const completed = mp.practicalDone
                        const inProgress = mp.lectureRead && !completed

                        return (
                            <div
                                key={module.id}
                                onClick={() => handleModuleClick(idx)}
                                style={{
                                    background: isDark ? '#181926' : '#fff',
                                    border: `1px solid ${locked ? t.border : completed ? (isDark ? '#2A5A3A' : '#9AE6B4') : t.border}`,
                                    borderRadius: 10,
                                    padding: '16px 20px',
                                    cursor: locked ? 'not-allowed' : 'pointer',
                                    opacity: locked ? 0.55 : 1,
                                    transition: 'box-shadow 0.15s, border-color 0.15s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 14,
                                }}
                                onMouseEnter={e => {
                                    if (!locked) {
                                        e.currentTarget.style.boxShadow = `0 3px 14px ${accent}22`
                                        if (!completed) e.currentTarget.style.borderColor = accent
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = 'none'
                                    e.currentTarget.style.borderColor = completed
                                        ? (isDark ? '#2A5A3A' : '#9AE6B4')
                                        : t.border
                                }}
                            >
                                {/* Module number / status icon */}
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: locked ? 18 : 15,
                                    fontWeight: 700,
                                    background: locked
                                        ? (isDark ? '#2A2D3E' : '#F4F6FA')
                                        : completed
                                            ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                            : (isDark ? '#1E3A5F' : '#EBF4FF'),
                                    color: locked
                                        ? t.textSecondary
                                        : completed
                                            ? (isDark ? '#A6E3A1' : '#276749')
                                            : accent,
                                }}>
                                    {locked ? '🔒' : completed ? '✅' : idx + 1}
                                </div>

                                {/* Title + steps */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>Модуль {idx + 1}</span>
                                        {completed && (
                                            <span style={{
                                                fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 500,
                                                background: isDark ? '#1A3A2A' : '#E6FFEE',
                                                color: isDark ? '#A6E3A1' : '#276749',
                                            }}>Завершён</span>
                                        )}
                                        {inProgress && (
                                            <span style={{
                                                fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 500,
                                                background: isDark ? '#1E3A5F' : '#EBF4FF',
                                                color: accent,
                                            }}>В процессе</span>
                                        )}
                                        {locked && (
                                            <span style={{
                                                fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 500,
                                                background: isDark ? '#2A2D3E' : '#F4F6FA',
                                                color: t.textSecondary,
                                            }}>Заблокирован</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {module.title}
                                    </div>

                                    {/* Step completion icons */}
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <StepBadge label="Лекция" done={mp.lectureRead} isDark={isDark} t={t} accent={accent} />
                                        <StepBadge label="Тест" done={mp.quizPassed} isDark={isDark} t={t} accent={accent} />
                                        <StepBadge label="Практика" done={mp.practicalDone} isDark={isDark} t={t} accent={accent} />
                                    </div>
                                </div>

                                {/* Arrow */}
                                {!locked && (
                                    <span style={{ color: t.textSecondary, fontSize: 18, flexShrink: 0 }}>›</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function StepBadge({ label, done, isDark, t, accent }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11,
            color: done ? (isDark ? '#A6E3A1' : '#276749') : t.textSecondary,
        }}>
            <span style={{ fontSize: 12 }}>{done ? '✓' : '○'}</span>
            <span>{label}</span>
        </div>
    )
}
