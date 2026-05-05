// src/pages/Login.jsx
// Страница входа — для учителя, ученика и администратора

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'

export default function Login() {
    const { login } = useAuth()
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const navigate = useNavigate()

    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)
    const [showPass, setShowPass] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!email || !password) {
            setError('Заполните все поля')
            return
        }
        setLoading(true)
        setError('')

        const result = await login(email, password)
        setLoading(false)

        if (result.success) {
            // Редирект в зависимости от роли
            if (result.user.role === 'admin')   navigate('/admin')
            if (result.user.role === 'teacher') navigate('/')
            if (result.user.role === 'student') navigate('/student')
        } else {
            setError(result.error)
        }
    }

    // Быстрый вход (для демо / диплома)
    function quickLogin(email, password) {
        setEmail(email)
        setPassword(password)
    }

    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const inputStyle = (focused) => ({
        width: '100%',
        padding: '11px 14px',
        borderRadius: 10,
        fontSize: 14,
        border: `1.5px solid ${focused ? accent : t.border}`,
        background: isDark ? '#1E1F2E' : '#F4F6FA',
        color: t.text,
        outline: 'none',
        transition: 'border-color 0.15s',
        fontFamily: 'inherit',
    })

    const [emailFocused, setEmailFocused]   = useState(false)
    const [passFocused,  setPassFocused]    = useState(false)

    return (
        <div style={{
            minHeight: '100vh',
            background: isDark ? '#1A1B2E' : '#F4F6FA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
        }}>
            <div style={{ width: '100%', maxWidth: 420 }}>

                {/* Лого */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        boxShadow: `0 4px 16px ${accent}44`,
                    }}>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                            <path d="M3 6.5h20M3 13h13M3 19.5h16" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: t.text, marginBottom: 4 }}>
                        Цифровой тренажёр
                    </div>
                    <div style={{ fontSize: 13, color: t.textSecondary }}>
                        для учителей информатики
                    </div>
                </div>

                {/* Карточка */}
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 16,
                    padding: '32px 28px',
                    boxShadow: isDark
                        ? '0 4px 24px rgba(0,0,0,0.4)'
                        : '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                        Вход в систему
                    </h2>
                    <p style={{ fontSize: 13, color: t.textSecondary, marginBottom: 24 }}>
                        Введите данные которые вам выдал администратор
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Email */}
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 500, color: t.text, display: 'block', marginBottom: 6 }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="example@school.kz"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                style={inputStyle(emailFocused)}
                                autoComplete="email"
                            />
                        </div>

                        {/* Пароль */}
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 500, color: t.text, display: 'block', marginBottom: 6 }}>
                                Пароль
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Введите пароль"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setPassFocused(true)}
                                    onBlur={() => setPassFocused(false)}
                                    style={{ ...inputStyle(passFocused), paddingRight: 44 }}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', fontSize: 16,
                                        color: t.textSecondary,
                                        display: 'flex', alignItems: 'center',
                                    }}
                                >
                                    {showPass ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        {/* Ошибка */}
                        {error && (
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: 8,
                                background: isDark ? '#2E1A1A' : '#FFF5F5',
                                border: `1px solid ${isDark ? '#5A2A2A' : '#FED7D7'}`,
                                fontSize: 13,
                                color: isDark ? '#F28B82' : '#C53030',
                                display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Кнопка входа */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px 0',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 600,
                                border: 'none',
                                background: loading ? t.border : accent,
                                color: loading ? t.textSecondary : '#fff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 8,
                                boxShadow: loading ? 'none' : `0 2px 12px ${accent}44`,
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: 16, height: 16, borderRadius: '50%',
                                        border: `2px solid ${t.textSecondary}`,
                                        borderTopColor: 'transparent',
                                        animation: 'spin 0.7s linear infinite',
                                    }} />
                                    Входим...
                                </>
                            ) : 'Войти'}
                        </button>

                    </form>
                </div>

                {/* Демо-аккаунты */}
                <div style={{
                    marginTop: 20,
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 14,
                    padding: '18px 20px',
                }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.textSecondary, marginBottom: 12, textAlign: 'center' }}>
                        🧪 Тестовые аккаунты (для демонстрации)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                            { role: 'Администратор', email: 'admin@trainer.kz',  password: 'admin123',   icon: '🔧', color: isDark ? '#CBA6F7' : '#6B4FC8', bg: isDark ? '#2E1A3A' : '#F5F0FF' },
                            { role: 'Учитель',       email: 'aigerim@school.kz', password: 'teacher123', icon: '👩‍🏫', color: isDark ? '#89B4FA' : '#1A6EFF', bg: isDark ? '#1E3A5F' : '#EBF4FF' },
                            { role: 'Ученик',        email: 'aliya@school.kz',   password: 'student123', icon: '👨‍🎓', color: isDark ? '#A6E3A1' : '#276749', bg: isDark ? '#1A3A2A' : '#E6FFEE' },
                        ].map(acc => (
                            <button
                                key={acc.role}
                                onClick={() => quickLogin(acc.email, acc.password)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 14px',
                                    borderRadius: 9,
                                    background: acc.bg,
                                    border: `1px solid ${t.border}`,
                                    cursor: 'pointer',
                                    transition: 'opacity 0.12s',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <span style={{ fontSize: 18 }}>{acc.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: acc.color }}>{acc.role}</div>
                                    <div style={{ fontSize: 11, color: t.textSecondary }}>{acc.email}</div>
                                </div>
                                <div style={{ fontSize: 11, color: t.textSecondary }}>
                                    Заполнить →
                                </div>
                            </button>
                        ))}
                    </div>
                    <div style={{ fontSize: 11, color: t.textSecondary, marginTop: 10, textAlign: 'center' }}>
                        Нажми на аккаунт — данные заполнятся автоматически
                    </div>
                </div>

            </div>

            {/* Анимация спиннера */}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}