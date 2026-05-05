import { Component } from 'react'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'

function ErrorFallback({ error, reset }) {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    return (
        <div style={{
            minHeight: '100vh',
            background: t.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
        }}>
            <div style={{ width: '100%', maxWidth: 440 }}>

                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: isDark ? '#2E1A1A' : '#FFF5F5',
                        border: `1px solid ${isDark ? '#5A2A2A' : '#FED7D7'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        fontSize: 24,
                    }}>
                        ⚠️
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: t.text, marginBottom: 4 }}>
                        Что-то пошло не так
                    </div>
                    <div style={{ fontSize: 13, color: t.textSecondary }}>
                        Произошла непредвиденная ошибка
                    </div>
                </div>

                {/* Card */}
                <div style={{
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    borderRadius: 16,
                    padding: '24px 28px',
                    boxShadow: isDark
                        ? '0 4px 24px rgba(0,0,0,0.4)'
                        : '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                    {/* Error message */}
                    <div style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: isDark ? '#2E1A1A' : '#FFF5F5',
                        border: `1px solid ${isDark ? '#5A2A2A' : '#FED7D7'}`,
                        fontSize: 12,
                        color: isDark ? '#F28B82' : '#C53030',
                        fontFamily: 'monospace',
                        marginBottom: 20,
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                    }}>
                        {error?.message || 'Unknown error'}
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={reset}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                borderRadius: 9, fontSize: 13, fontWeight: 600,
                                border: 'none',
                                background: accent,
                                color: '#fff',
                                cursor: 'pointer',
                                boxShadow: `0 2px 10px ${accent}44`,
                            }}
                        >
                            Попробовать снова
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                borderRadius: 9, fontSize: 13, fontWeight: 500,
                                border: `1px solid ${t.border}`,
                                background: 'transparent',
                                color: t.textSecondary,
                                cursor: 'pointer',
                            }}
                        >
                            На главную
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    reset() {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    error={this.state.error}
                    reset={() => this.reset()}
                />
            )
        }
        return this.props.children
    }
}
