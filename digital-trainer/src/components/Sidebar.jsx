// src/components/Sidebar.jsx
// Обновлённый сайдбар — меню зависит от роли пользователя

import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { themes } from '../styles/themes'

// Пункты меню для учителя
const teacherNav = [
    { to: '/',        label: 'Главная',       icon: '⊞', end: true },
    { to: '/theory',  label: 'Теория',        icon: '📖' },
    { to: '/tasks',   label: 'Задания',       icon: '✓', badge: 5 },
    { to: '/lessons', label: 'Планы уроков',  icon: '📋' },
    { to: '/sandbox', label: 'Песочница',     icon: '💻' },
]

const teacherOnly = [
    { to: '/students', label: 'Мои ученики',  icon: '👥' },
    { to: '/progress', label: 'Успеваемость', icon: '📈' },
]

// Пункты меню для ученика (позже)
const studentNav = [
    { to: '/student',          label: 'Главная',   icon: '⊞', end: true },
    { to: '/student/courses',  label: 'Курсы',     icon: '🎓' },
    { to: '/student/theory',   label: 'Теория',    icon: '📖' },
    { to: '/student/tasks',    label: 'Задания',   icon: '✓' },
    { to: '/student/sandbox',  label: 'Песочница', icon: '💻' },
]

// Пункты для админа
const adminNav = [
    { to: '/admin',   label: 'Панель управления', icon: '🔧', end: true },
    { to: '/',        label: 'Учительская',        icon: '👩‍🏫' },
]

export default function Sidebar() {
    const { theme } = useTheme()
    const { user, logout } = useAuth()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const navigate = useNavigate()

    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    function handleLogout() {
        logout()
        navigate('/login')
    }

    const itemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 14px',
        margin: '1px 8px',
        borderRadius: 7,
        fontSize: 13,
        textDecoration: 'none',
        borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
        background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
        color: isActive ? accent : t.textSecondary,
        fontWeight: isActive ? 500 : 400,
        transition: 'all 0.12s',
    })

    // Определяем какое меню показывать
    const role = user?.role || 'teacher'
    const mainNav   = role === 'student' ? studentNav : role === 'admin' ? adminNav : teacherNav
    const extraNav  = role === 'teacher' || role === 'admin' ? teacherOnly : []

    // Метка роли
    const roleLabel = { admin: 'Администратор', teacher: 'Учитель', student: 'Ученик' }
    const roleColor = {
        admin:   { bg: isDark ? '#2E1A3A' : '#F5F0FF', color: isDark ? '#CBA6F7' : '#6B4FC8' },
        teacher: { bg: isDark ? '#1E3A5F' : '#EBF4FF', color: isDark ? '#89B4FA' : '#1A6EFF' },
        student: { bg: isDark ? '#1A3A2A' : '#E6FFEE', color: isDark ? '#A6E3A1' : '#276749' },
    }

    return (
        <div style={{
            width: 215,
            minWidth: 215,
            height: '100vh',
            background: isDark ? '#13141F' : '#fff',
            borderRight: `1px solid ${t.border}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
        }}>

            {/* Лого */}
            <div style={{ padding: '18px 16px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: accent,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: 10,
                    boxShadow: `0 2px 8px ${accent}44`,
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 5h14M3 10h9M3 15h11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, lineHeight: 1.4 }}>
                    Цифровой тренажёр
                </div>
                <div style={{ fontSize: 11, color: t.textSecondary, marginTop: 2 }}>
                    для учителей информатики
                </div>
            </div>

            {/* Навигация */}
            <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>

                <div style={{ fontSize: 10, color: t.textSecondary, padding: '4px 16px 5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {role === 'admin' ? 'Управление' : role === 'student' ? 'Обучение' : 'Обучение'}
                </div>

                {mainNav.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        style={({ isActive }) => itemStyle(isActive)}
                    >
                        <span style={{ fontSize: 15 }}>{item.icon}</span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge && (
                            <span style={{
                                background: accent, color: isDark ? '#1E1F2E' : '#fff',
                                fontSize: 10, padding: '1px 6px', borderRadius: 8,
                            }}>
                {item.badge}
              </span>
                        )}
                    </NavLink>
                ))}

                {extraNav.length > 0 && (
                    <>
                        <div style={{ fontSize: 10, color: t.textSecondary, padding: '12px 16px 5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Учитель
                        </div>
                        {extraNav.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                style={({ isActive }) => itemStyle(isActive)}
                            >
                                <span style={{ fontSize: 15 }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </>
                )}
            </nav>

            {/* Профиль + выход */}
            <div style={{ borderTop: `1px solid ${t.border}` }}>

                {/* Роль пользователя */}
                <div style={{ padding: '10px 16px 0' }}>
          <span style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 20,
              background: roleColor[role].bg,
              color: roleColor[role].color,
              fontWeight: 500,
          }}>
            {roleLabel[role]}
          </span>
                </div>

                {/* Имя и выход */}
                <div style={{ padding: '8px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: roleColor[role].bg,
                        color: roleColor[role].color,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 11, fontWeight: 700,
                        flexShrink: 0,
                    }}>
                        {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'АИ'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'Пользователь'}
                        </div>
                        <div style={{ fontSize: 10, color: t.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.email || ''}
                        </div>
                    </div>

                    {/* Кнопка выхода */}
                    <button
                        onClick={handleLogout}
                        title="Выйти"
                        style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', padding: 4,
                            color: t.textSecondary, fontSize: 16,
                            borderRadius: 6,
                            transition: 'all 0.12s',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#2A2D3E' : '#F4F6FA'; e.currentTarget.style.color = isDark ? '#F28B82' : '#C53030' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = t.textSecondary }}
                    >
                        ⎋
                    </button>
                </div>
            </div>
        </div>
    )
}