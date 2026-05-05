import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div style={{
            display: 'flex', gap: 4,
            background: isDark ? '#313244' : '#F4F6FA',
            border: `1px solid ${isDark ? '#45475A' : '#CBD5E0'}`,
            borderRadius: 8,
            padding: 3,
        }}>
            {['light', 'dark'].map(t => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                        padding: '5px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: theme === t
                            ? (t === 'light' ? '#1A202C' : '#CDD6F4')
                            : 'transparent',
                        color: theme === t
                            ? (t === 'light' ? '#fff' : '#1E1F2E')
                            : (isDark ? '#7F849C' : '#4A5568'),
                        fontWeight: theme === t ? 500 : 400,
                    }}
                >
                    {t === 'light' ? '☀️ Светлая' : '🌙 Тёмная'}
                </button>
            ))}
        </div>
    )
}