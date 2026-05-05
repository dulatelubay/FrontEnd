import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@uiw/react-codemirror'

const starterCode = `import pandas as pd
import matplotlib.pyplot as plt

data = {'Оценка': [85, 92, 78, 95, 88, 72, 91, 83]}
df = pd.DataFrame(data)

print("Среднее:", df['Оценка'].mean())
print("Медиана:", df['Оценка'].median())

plt.figure(figsize=(6, 4))
plt.hist(df['Оценка'], bins=5, color='steelblue', edgecolor='white')
plt.title('Распределение оценок')
plt.xlabel('Оценка')
plt.ylabel('Частота')
plt.tight_layout()
plt.show()`

export default function StudentSandbox() {
    const { accessToken } = useAuth()
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const [code, setCode] = useState(starterCode)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    async function runCode() {
        setLoading(true)
        setResult(null)
        try {
            const response = await fetch('http://localhost:8084/sandbox/execute-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: code,
            })
            const data = await response.json()
            setResult(data)
        } catch (error) {
            setResult({ output: '', figures: [], error: `Ошибка подключения: ${error.message}` })
        } finally {
            setLoading(false)
        }
    }

    const hasOutput = result?.output?.trim()
    const hasError = result?.error
    const hasFigures = result?.figures?.length > 0

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Практика кода</span>
                </div>
                <ThemeToggle />
            </div>

            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                }}>
                    <div>
                        <h1 style={{ margin: 0, color: t.text, fontSize: 24, fontWeight: 650 }}>
                            Практика кода
                        </h1>
                        <p style={{ margin: '6px 0 0', color: t.textSecondary, fontSize: 13 }}>
                            Напиши код, запусти его и проверь результат в консоли.
                        </p>
                    </div>
                    <button
                        onClick={runCode}
                        disabled={loading}
                        style={{
                            padding: '10px 18px',
                            borderRadius: 8,
                            border: 'none',
                            background: loading ? t.border : accent,
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : `0 2px 8px ${accent}44`,
                        }}
                    >
                        {loading ? 'Выполняется...' : 'Запустить'}
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.15fr) minmax(280px, 0.85fr)',
                    gap: 16,
                    alignItems: 'stretch',
                }}>
                    <section style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 8,
                        overflow: 'hidden',
                        minHeight: 440,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{
                            padding: '12px 14px',
                            borderBottom: `1px solid ${t.border}`,
                            color: t.text,
                            fontSize: 13,
                            fontWeight: 600,
                        }}>
                            Код
                        </div>
                        <CodeMirror
                            value={code}
                            onChange={setCode}
                            extensions={[python()]}
                            theme={isDark ? oneDark : 'light'}
                            style={{ flex: 1, fontSize: 14, minHeight: 390 }}
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: false,
                                dropCursor: false,
                                indentOnInput: true,
                            }}
                        />
                    </section>

                    <section style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 8,
                        overflow: 'hidden',
                        minHeight: 440,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{
                            padding: '12px 14px',
                            borderBottom: `1px solid ${t.border}`,
                            color: t.text,
                            fontSize: 13,
                            fontWeight: 600,
                        }}>
                            Вывод результата
                        </div>
                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            background: isDark ? '#11111B' : '#F8FAFC',
                        }}>
                            {!result && !loading && (
                                <pre style={outputTextStyle(isDark, false)}>
                                    Результат появится здесь после запуска кода.
                                </pre>
                            )}
                            {loading && (
                                <pre style={outputTextStyle(isDark, false)}>Выполняется...</pre>
                            )}
                            {result && (
                                <>
                                    {hasOutput && (
                                        <pre style={outputTextStyle(isDark, false)}>
                                            {result.output}
                                        </pre>
                                    )}
                                    {hasError && (
                                        <pre style={outputTextStyle(isDark, true)}>
                                            {result.error}
                                        </pre>
                                    )}
                                    {!hasOutput && !hasError && (
                                        <pre style={outputTextStyle(isDark, false)}>
                                            Код выполнен без вывода.
                                        </pre>
                                    )}
                                    {hasFigures && (
                                        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {result.figures.map((b64, i) => (
                                                <img
                                                    key={i}
                                                    src={`data:image/png;base64,${b64}`}
                                                    alt={`График ${i + 1}`}
                                                    style={{ maxWidth: '100%', borderRadius: 6, display: 'block' }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function outputTextStyle(isDark, isError) {
    return {
        margin: 0,
        padding: '16px',
        background: 'transparent',
        color: isError
            ? (isDark ? '#F28B82' : '#C53030')
            : (isDark ? '#CDD6F4' : '#1A202C'),
        fontFamily: 'Consolas, Monaco, monospace',
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
    }
}
