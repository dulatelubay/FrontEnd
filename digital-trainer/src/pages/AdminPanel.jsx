import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'

const roleMeta = {
    admin: {
        short: 'Админ',
        color: '#6B4FC8',
        darkColor: '#CBA6F7',
        bg: '#F5F0FF',
        darkBg: '#2E1A3A',
    },
    teacher: {
        short: 'Учитель',
        color: '#1A6EFF',
        darkColor: '#89B4FA',
        bg: '#EBF4FF',
        darkBg: '#1E3A5F',
    },
    student: {
        short: 'Ученик',
        color: '#276749',
        darkColor: '#A6E3A1',
        bg: '#E6FFEE',
        darkBg: '#1A3A2A',
    },
}

const emptyForm = {
    name: '',
    email: '',
    password: '',
    role: 'student',
}

function getInitials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

export default function AdminPanel() {
    const { users, user, addUser, deleteUser } = useAuth()
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#CBA6F7' : '#6B4FC8'

    const [form, setForm] = useState(emptyForm)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const totalByRole = {
        admin: users.filter(account => account.role === 'admin').length,
        teacher: users.filter(account => account.role === 'teacher').length,
        student: users.filter(account => account.role === 'student').length,
    }

    function handleChange(event) {
        const { name, value } = event.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setMessage('')

        const result = addUser(form)
        if (!result.success) {
            setError(result.error)
            return
        }

        setForm(emptyForm)
        setMessage('Пользователь добавлен')
    }

    function handleDelete(account) {
        setError('')
        setMessage('')

        const result = deleteUser(account.id)
        if (!result.success) {
            setError(result.error)
            return
        }

        setMessage('Пользователь удалён')
    }

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: `1px solid ${t.border}`,
        background: isDark ? '#1E1F2E' : '#F4F6FA',
        color: t.text,
        fontSize: 13,
        outline: 'none',
        boxSizing: 'border-box',
    }

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 24px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Панель управления</div>
                    <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>Пользователи и роли</div>
                </div>
                <ThemeToggle />
            </div>

            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gap: 12,
                }}>
                    {[
                        { label: 'Всего пользователей', value: users.length, color: accent },
                        { label: 'Администраторы', value: totalByRole.admin, color: isDark ? roleMeta.admin.darkColor : roleMeta.admin.color },
                        { label: 'Учителя', value: totalByRole.teacher, color: isDark ? roleMeta.teacher.darkColor : roleMeta.teacher.color },
                        { label: 'Ученики', value: totalByRole.student, color: isDark ? roleMeta.student.darkColor : roleMeta.student.color },
                    ].map(item => (
                        <div
                            key={item.label}
                            style={{
                                background: isDark ? '#181926' : '#fff',
                                border: `1px solid ${t.border}`,
                                borderRadius: 8,
                                padding: '15px 16px',
                            }}
                        >
                            <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.value}</div>
                            <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>{item.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(320px, 0.42fr) minmax(0, 1fr)',
                    gap: 16,
                    alignItems: 'start',
                }}>
                    <section style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 8,
                        padding: 16,
                    }}>
                        <h2 style={{ margin: '0 0 14px', fontSize: 15, color: t.text }}>Добавить пользователя</h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: t.text }}>
                                Имя
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Например, Данияр Касымов"
                                    style={inputStyle}
                                />
                            </label>

                            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: t.text }}>
                                Email
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="user@school.kz"
                                    style={inputStyle}
                                />
                            </label>

                            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: t.text }}>
                                Пароль
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Временный пароль"
                                    style={inputStyle}
                                />
                            </label>

                            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: t.text }}>
                                Роль
                                <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
                                    <option value="student">Ученик</option>
                                    <option value="teacher">Учитель</option>
                                    <option value="admin">Администратор</option>
                                </select>
                            </label>

                            {(error || message) && (
                                <div style={{
                                    padding: '9px 11px',
                                    borderRadius: 8,
                                    fontSize: 12,
                                    background: error ? (isDark ? '#2E1A1A' : '#FFF5F5') : (isDark ? '#1A3A2A' : '#E6FFEE'),
                                    color: error ? (isDark ? '#F28B82' : '#C53030') : (isDark ? '#A6E3A1' : '#276749'),
                                    border: `1px solid ${error ? (isDark ? '#5A2A2A' : '#FED7D7') : (isDark ? '#2E5A3D' : '#C6F6D5')}`,
                                }}>
                                    {error || message}
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    padding: '11px 14px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: accent,
                                    color: '#fff',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Добавить
                            </button>
                        </form>
                    </section>

                    <section style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 8,
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '14px 16px',
                            borderBottom: `1px solid ${t.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <h2 style={{ margin: 0, fontSize: 15, color: t.text }}>Все пользователи</h2>
                            <span style={{ fontSize: 12, color: t.textSecondary }}>{users.length} аккаунта</span>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                                <thead>
                                    <tr style={{ background: isDark ? '#13141F' : '#F8FAFC' }}>
                                        {['Пользователь', 'Email', 'Роль', 'Пароль', 'Действия'].map(header => (
                                            <th
                                                key={header}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '11px 14px',
                                                    color: t.textSecondary,
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    borderBottom: `1px solid ${t.border}`,
                                                }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(account => {
                                        const meta = roleMeta[account.role]
                                        const roleColor = isDark ? meta.darkColor : meta.color
                                        const roleBg = isDark ? meta.darkBg : meta.bg
                                        const isCurrent = user?.email?.toLowerCase() === account.email.toLowerCase()

                                        return (
                                            <tr key={account.id}>
                                                <td style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}` }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{
                                                            width: 34,
                                                            height: 34,
                                                            borderRadius: 8,
                                                            background: roleBg,
                                                            color: roleColor,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: 12,
                                                            fontWeight: 700,
                                                            flexShrink: 0,
                                                        }}>
                                                            {getInitials(account.name)}
                                                        </div>
                                                        <div>
                                                            <div style={{ color: t.text, fontSize: 13, fontWeight: 500 }}>
                                                                {account.name}
                                                            </div>
                                                            {isCurrent && (
                                                                <div style={{ color: t.textSecondary, fontSize: 11, marginTop: 2 }}>
                                                                    Текущий аккаунт
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}`, color: t.textSecondary, fontSize: 13 }}>
                                                    {account.email}
                                                </td>
                                                <td style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}` }}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        padding: '4px 8px',
                                                        borderRadius: 999,
                                                        background: roleBg,
                                                        color: roleColor,
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}>
                                                        {meta.short}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}`, color: t.textSecondary, fontSize: 13 }}>
                                                    {account.password}
                                                </td>
                                                <td style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}` }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(account)}
                                                        disabled={isCurrent}
                                                        style={{
                                                            padding: '7px 10px',
                                                            borderRadius: 7,
                                                            border: `1px solid ${isCurrent ? t.border : (isDark ? '#5A2A2A' : '#FED7D7')}`,
                                                            background: isCurrent ? 'transparent' : (isDark ? '#2E1A1A' : '#FFF5F5'),
                                                            color: isCurrent ? t.textSecondary : (isDark ? '#F28B82' : '#C53030'),
                                                            fontSize: 12,
                                                            cursor: isCurrent ? 'not-allowed' : 'pointer',
                                                        }}
                                                    >
                                                        Удалить
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
