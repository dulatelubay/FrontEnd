// src/pages/student/StudentModuleView.jsx
// Main learning view: lecture → quiz → practical

import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'
import {
    COURSES,
    readProgress,
    getModuleProgress,
    patchModuleProgress,
    isModuleLocked,
    getDefaultStep,
} from '../../data/courseData'

// ─── Lecture renderer ─────────────────────────────────────────────────────────

function LectureView({ module, t, isDark, accent, onDone }) {
    return (
        <div style={{ padding: '28px 32px', maxWidth: 740 }}>
            {module.lecture.blocks.map((block, i) => {
                switch (block.type) {

                    case 'heading':
                        return (
                            <h3 key={i} style={{
                                margin: '28px 0 10px',
                                fontSize: 18, fontWeight: 650, color: t.text,
                                borderBottom: `2px solid ${t.border}`,
                                paddingBottom: 6,
                            }}>
                                {block.text}
                            </h3>
                        )

                    case 'paragraph':
                        return (
                            <p key={i} style={{
                                margin: '0 0 16px', fontSize: 14, color: t.text,
                                lineHeight: 1.75,
                            }}>
                                {block.text}
                            </p>
                        )

                    case 'code':
                        return (
                            <div key={i} style={{ margin: '4px 0 20px' }}>
                                <div style={{
                                    background: '#1A202C',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    border: `1px solid ${isDark ? '#2A2D3E' : '#CBD5E0'}`,
                                }}>
                                    <div style={{
                                        padding: '7px 14px',
                                        borderBottom: '1px solid #2D3748',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}>
                                        <span style={{ fontSize: 10, color: '#718096', fontFamily: 'monospace' }}>
                                            python
                                        </span>
                                    </div>
                                    <pre style={{
                                        margin: 0,
                                        padding: '16px',
                                        background: 'transparent',
                                        color: '#CDD6F4',
                                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                        fontSize: 13,
                                        lineHeight: 1.65,
                                        overflowX: 'auto',
                                        whiteSpace: 'pre',
                                    }}>
                                        {block.text}
                                    </pre>
                                </div>
                            </div>
                        )

                    case 'callout': {
                        const variants = {
                            tip:     { icon: '💡', bg: isDark ? '#1A3A2A' : '#F0FFF4', border: isDark ? '#2A5A3A' : '#9AE6B4', color: isDark ? '#A6E3A1' : '#276749', label: 'Совет' },
                            info:    { icon: 'ℹ️', bg: isDark ? '#1E3A5F' : '#EBF4FF', border: isDark ? '#2A4A7F' : '#90CDF4', color: isDark ? '#89B4FA' : '#1A6EFF', label: 'Инфо' },
                            warning: { icon: '⚠️', bg: isDark ? '#3A2E10' : '#FFFBEB', border: isDark ? '#6B5A20' : '#F6E05E', color: isDark ? '#F9E2AF' : '#975A16', label: 'Внимание' },
                        }
                        const v = variants[block.variant] || variants.info
                        return (
                            <div key={i} style={{
                                margin: '4px 0 20px',
                                background: v.bg,
                                border: `1px solid ${v.border}`,
                                borderLeft: `4px solid ${v.border}`,
                                borderRadius: 8,
                                padding: '12px 16px',
                                display: 'flex', gap: 10, alignItems: 'flex-start',
                            }}>
                                <span style={{ fontSize: 16, flexShrink: 0 }}>{v.icon}</span>
                                <p style={{ margin: 0, fontSize: 13, color: v.color, lineHeight: 1.65 }}>
                                    {block.text}
                                </p>
                            </div>
                        )
                    }

                    case 'list':
                        return (
                            <ul key={i} style={{ margin: '0 0 18px', paddingLeft: 24 }}>
                                {block.items.map((item, j) => (
                                    <li key={j} style={{
                                        fontSize: 14, color: t.text, lineHeight: 1.75, marginBottom: 4,
                                    }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )

                    default:
                        return null
                }
            })}

            {/* Complete lecture button */}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
                <button
                    onClick={onDone}
                    style={{
                        padding: '11px 28px',
                        background: accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: `0 2px 10px ${accent}44`,
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                    Лекция прочитана →
                </button>
            </div>
        </div>
    )
}

// ─── Quiz view ────────────────────────────────────────────────────────────────

function QuizView({ module, t, isDark, accent, onPass }) {
    const quiz = module.quiz
    const [answers, setAnswers] = useState({}) // { questionId: optionIndex }
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    function selectAnswer(qId, optIdx) {
        if (submitted) return
        setAnswers(prev => ({ ...prev, [qId]: optIdx }))
    }

    function handleSubmit() {
        let correct = 0
        quiz.questions.forEach(q => {
            const chosen = answers[q.id]
            if (chosen !== undefined && q.correct.includes(chosen)) correct++
        })
        const pct = Math.round((correct / quiz.questions.length) * 100)
        setScore(pct)
        setSubmitted(true)
    }

    function handleRetry() {
        setAnswers({})
        setSubmitted(false)
        setScore(0)
    }

    const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined)
    const passed = submitted && score >= quiz.passingScore

    return (
        <div style={{ padding: '28px 32px', maxWidth: 740 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 650, color: t.text }}>
                Тест по модулю
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: t.textSecondary }}>
                Для прохождения необходимо набрать {quiz.passingScore}% и выше.
            </p>

            {quiz.questions.map((q, qi) => {
                const chosen = answers[q.id]
                const isCorrect = submitted && chosen !== undefined && q.correct.includes(chosen)
                const isWrong = submitted && chosen !== undefined && !q.correct.includes(chosen)
                const notAnswered = submitted && chosen === undefined

                return (
                    <div key={q.id} style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                            <div style={{
                                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                background: submitted
                                    ? isCorrect ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                        : isWrong ? (isDark ? '#3A1A1A' : '#FFF5F5')
                                            : (isDark ? '#2A2D3E' : '#F4F6FA')
                                    : (isDark ? '#2A2D3E' : '#F4F6FA'),
                                color: submitted
                                    ? isCorrect ? (isDark ? '#A6E3A1' : '#276749')
                                        : isWrong ? (isDark ? '#F28B82' : '#C53030')
                                            : t.textSecondary
                                    : t.textSecondary,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700,
                            }}>
                                {submitted
                                    ? isCorrect ? '✓'
                                        : isWrong ? '✗'
                                            : '?'
                                    : qi + 1}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 500, color: t.text, lineHeight: 1.5 }}>
                                {q.text}
                            </span>
                        </div>

                        <div style={{ paddingLeft: 36, display: 'flex', flexDirection: 'column', gap: 7 }}>
                            {q.options.map((opt, oi) => {
                                const isChosen = chosen === oi
                                const isRight = q.correct.includes(oi)
                                let bg = isDark ? '#181926' : '#F8FAFC'
                                let border = t.border
                                let color = t.text

                                if (submitted) {
                                    if (isRight) {
                                        bg = isDark ? '#1A3A2A' : '#F0FFF4'
                                        border = isDark ? '#2A5A3A' : '#9AE6B4'
                                        color = isDark ? '#A6E3A1' : '#276749'
                                    } else if (isChosen && !isRight) {
                                        bg = isDark ? '#3A1A1A' : '#FFF5F5'
                                        border = isDark ? '#6B2A2A' : '#FC8181'
                                        color = isDark ? '#F28B82' : '#C53030'
                                    }
                                } else if (isChosen) {
                                    bg = isDark ? '#1E3A5F' : '#EBF4FF'
                                    border = accent
                                    color = accent
                                }

                                return (
                                    <button
                                        key={oi}
                                        onClick={() => selectAnswer(q.id, oi)}
                                        disabled={submitted}
                                        style={{
                                            width: '100%', textAlign: 'left',
                                            padding: '10px 14px',
                                            background: bg,
                                            border: `1px solid ${border}`,
                                            borderRadius: 8,
                                            color,
                                            fontSize: 13,
                                            cursor: submitted ? 'default' : 'pointer',
                                            transition: 'all 0.12s',
                                            fontFamily: 'inherit',
                                            fontWeight: isChosen || (submitted && isRight) ? 500 : 400,
                                        }}
                                        onMouseEnter={e => {
                                            if (!submitted && !isChosen) {
                                                e.currentTarget.style.borderColor = accent
                                                e.currentTarget.style.background = isDark ? '#1A2840' : '#F0F6FF'
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!submitted && !isChosen) {
                                                e.currentTarget.style.borderColor = t.border
                                                e.currentTarget.style.background = isDark ? '#181926' : '#F8FAFC'
                                            }
                                        }}
                                    >
                                        <span style={{
                                            display: 'inline-block', width: 20, height: 20,
                                            borderRadius: '50%',
                                            border: `2px solid ${border}`,
                                            marginRight: 10,
                                            verticalAlign: 'middle',
                                            background: isChosen || (submitted && isRight) ? border : 'transparent',
                                            flexShrink: 0,
                                        }} />
                                        {opt}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Explanation after submit */}
                        {submitted && (
                            <div style={{
                                marginTop: 8, marginLeft: 36,
                                padding: '9px 13px',
                                borderRadius: 7,
                                background: isDark ? '#1E1F2E' : '#F0F6FF',
                                border: `1px solid ${isDark ? '#2A2D3E' : '#BEE3F8'}`,
                                fontSize: 12,
                                color: t.textSecondary,
                                lineHeight: 1.55,
                            }}>
                                {q.explanation}
                            </div>
                        )}
                    </div>
                )
            })}

            {/* Result banner */}
            {submitted && (
                <div style={{
                    marginBottom: 20, padding: '14px 18px',
                    borderRadius: 10,
                    background: passed
                        ? (isDark ? '#1A3A2A' : '#F0FFF4')
                        : (isDark ? '#3A2E10' : '#FFFBEB'),
                    border: `1px solid ${passed
                        ? (isDark ? '#2A5A3A' : '#9AE6B4')
                        : (isDark ? '#6B5A20' : '#F6E05E')}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                }}>
                    <div>
                        <div style={{
                            fontSize: 15, fontWeight: 600,
                            color: passed
                                ? (isDark ? '#A6E3A1' : '#276749')
                                : (isDark ? '#F9E2AF' : '#975A16'),
                            marginBottom: 3,
                        }}>
                            {passed ? '🎉 Тест пройден!' : '😕 Попробуйте ещё раз'}
                        </div>
                        <div style={{ fontSize: 13, color: t.textSecondary }}>
                            Результат: {score}% (порог: {quiz.passingScore}%)
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {!passed && (
                            <button
                                onClick={handleRetry}
                                style={{
                                    padding: '9px 18px', borderRadius: 8, fontSize: 13,
                                    background: isDark ? '#3A2E10' : '#FFFBEB',
                                    color: isDark ? '#F9E2AF' : '#975A16',
                                    border: `1px solid ${isDark ? '#6B5A20' : '#F6E05E'}`,
                                    fontWeight: 500, cursor: 'pointer',
                                }}
                            >
                                Пройти ещё раз
                            </button>
                        )}
                        {passed && (
                            <button
                                onClick={() => onPass(score)}
                                style={{
                                    padding: '9px 20px', borderRadius: 8, fontSize: 13,
                                    background: isDark ? '#A6E3A1' : '#38A169',
                                    color: '#fff',
                                    border: 'none',
                                    fontWeight: 600, cursor: 'pointer',
                                    boxShadow: '0 2px 8px #38A16944',
                                }}
                            >
                                Перейти к практике →
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Submit button */}
            {!submitted && (
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    style={{
                        padding: '11px 28px', borderRadius: 8, fontSize: 14,
                        background: allAnswered ? accent : t.border,
                        color: allAnswered ? '#fff' : t.textSecondary,
                        border: 'none',
                        fontWeight: 600,
                        cursor: allAnswered ? 'pointer' : 'not-allowed',
                        boxShadow: allAnswered ? `0 2px 10px ${accent}44` : 'none',
                        transition: 'all 0.15s',
                    }}
                >
                    Проверить ответы
                </button>
            )}
        </div>
    )
}

// ─── Practical view ───────────────────────────────────────────────────────────

function PracticalView({ module, t, isDark, accent, authFetch, practicalDone, onDone, isLastModule, onNextModule }) {
    const practical = module.practical
    const [code, setCode] = useState(practical.starterCode)
    const [running, setRunning] = useState(false)
    const [result, setResult] = useState(null)
    const [hasRun, setHasRun] = useState(false)

    async function runCode() {
        setRunning(true)
        setResult(null)
        try {
            const res = await authFetch('/sandbox/execute-code', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: code,
            })
            const data = await res.json()
            setResult(data)
            setHasRun(true)
        } catch (err) {
            setResult({ output: '', figures: [], error: `Ошибка подключения: ${err.message}` })
            setHasRun(true)
        } finally {
            setRunning(false)
        }
    }

    const hasOutput = result?.output?.trim()
    const hasError = result?.error
    const hasFigures = result?.figures?.length > 0

    return (
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

            {/* 1. Badge + Title */}
            <div>
                <span style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 600,
                    background: isDark ? '#1E3A5F' : '#EBF4FF', color: accent,
                }}>
                    Практическое задание
                </span>
                <h2 style={{ margin: '10px 0 0', fontSize: 20, fontWeight: 700, color: t.text }}>
                    {practical.title}
                </h2>
            </div>

            {/* 2. Context + Problem (full width) */}
            <div style={{
                background: isDark ? '#181926' : '#fff',
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                padding: '18px 20px',
                display: 'flex', flexDirection: 'column', gap: 14,
            }}>
                <Section icon="📋" label="Контекст" text={practical.context} t={t} isDark={isDark} />
                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
                    <Section icon="🎯" label="Задание" text={practical.problemStatement} t={t} isDark={isDark} />
                </div>
            </div>

            {/* 3. Input | Output (50/50) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 10, padding: '14px 16px',
                }}>
                    <Section icon="📊" label="Входные данные" text={practical.inputDescription} t={t} isDark={isDark} />
                </div>
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 10, padding: '14px 16px',
                }}>
                    <Section icon="✅" label="Ожидаемый результат" text={practical.expectedOutput} t={t} isDark={isDark} />
                </div>
            </div>

            {/* 4. Code editor (full width) */}
            <div style={{
                background: isDark ? '#181926' : '#fff',
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                overflow: 'hidden',
            }}>
                <div style={{
                    padding: '10px 14px', borderBottom: `1px solid ${t.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>Ваш код</span>
                    {practicalDone && (
                        <span style={{
                            fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 500,
                            background: isDark ? '#1A3A2A' : '#E6FFEE',
                            color: isDark ? '#A6E3A1' : '#276749',
                        }}>✅ Выполнено</span>
                    )}
                </div>
                <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                    style={{
                        width: '100%', minHeight: 300,
                        padding: '14px 16px',
                        background: '#11111B', color: '#CDD6F4',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: 13, lineHeight: 1.65,
                        border: 'none', outline: 'none',
                        resize: 'vertical', boxSizing: 'border-box',
                    }}
                />
                <div style={{
                    padding: '10px 14px', borderTop: `1px solid ${t.border}`,
                    display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                }}>
                    <button
                        onClick={runCode}
                        disabled={running}
                        style={{
                            padding: '8px 18px', borderRadius: 7, fontSize: 13,
                            background: running ? t.border : accent,
                            color: running ? t.textSecondary : '#fff',
                            border: 'none', fontWeight: 600,
                            cursor: running ? 'not-allowed' : 'pointer',
                            boxShadow: running ? 'none' : `0 2px 8px ${accent}44`,
                        }}
                    >
                        {running ? '⏳ Выполняется...' : '▶ Запустить код'}
                    </button>
                    {hasRun && !practicalDone && (
                        <button
                            onClick={onDone}
                            style={{
                                padding: '8px 18px', borderRadius: 7, fontSize: 13,
                                background: 'transparent',
                                color: isDark ? '#A6E3A1' : '#276749',
                                border: `1px solid ${isDark ? '#2A5A3A' : '#9AE6B4'}`,
                                fontWeight: 500, cursor: 'pointer',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1A3A2A' : '#F0FFF4' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                            Отметить как выполненное
                        </button>
                    )}
                </div>
            </div>

            {/* 5. Output panel (full width, scrollable) */}
            {(result || running) && (
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 10, overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '9px 14px', borderBottom: `1px solid ${t.border}`,
                        fontSize: 12, fontWeight: 600, color: t.text,
                    }}>
                        Результат выполнения
                    </div>
                    <div style={{
                        background: isDark ? '#11111B' : '#F8FAFC',
                        maxHeight: 500, overflowY: 'auto',
                    }}>
                        {running && <pre style={outputStyle(isDark, false)}>Выполняется...</pre>}
                        {result && (
                            <>
                                {hasOutput && <pre style={outputStyle(isDark, false)}>{result.output}</pre>}
                                {hasError && <pre style={outputStyle(isDark, true)}>{result.error}</pre>}
                                {!hasOutput && !hasError && <pre style={outputStyle(isDark, false)}>Код выполнен без вывода.</pre>}
                                {hasFigures && (
                                    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {result.figures.map((b64, i) => (
                                            <img key={i} src={`data:image/png;base64,${b64}`} alt={`График ${i + 1}`}
                                                style={{ maxWidth: '100%', borderRadius: 6, display: 'block' }} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 6. Next module / course complete banner */}
            {practicalDone && (
                <div style={{
                    padding: '18px 20px', borderRadius: 10,
                    background: isDark ? '#1A3A2A' : '#F0FFF4',
                    border: `1px solid ${isDark ? '#2A5A3A' : '#9AE6B4'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#A6E3A1' : '#276749', marginBottom: 2 }}>
                            {isLastModule ? '🎉 Курс пройден! Поздравляем!' : '✅ Модуль завершён'}
                        </div>
                        {!isLastModule && (
                            <div style={{ fontSize: 13, color: t.textSecondary }}>
                                Следующий модуль теперь доступен
                            </div>
                        )}
                    </div>
                    {!isLastModule && onNextModule && (
                        <button
                            onClick={onNextModule}
                            style={{
                                padding: '10px 22px', borderRadius: 8, fontSize: 14,
                                background: accent, color: '#fff',
                                border: 'none', fontWeight: 600, cursor: 'pointer',
                                boxShadow: `0 2px 10px ${accent}44`,
                            }}
                        >
                            Следующий модуль →
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

function Section({ icon, label, text, t, isDark }) {
    return (
        <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.textSecondary, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {icon} {label}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: t.text, lineHeight: 1.65 }}>{text}</p>
        </div>
    )
}

function outputStyle(isDark, isError) {
    return {
        margin: 0, padding: '14px 16px',
        background: 'transparent',
        color: isError ? (isDark ? '#F28B82' : '#C53030') : (isDark ? '#CDD6F4' : '#1A202C'),
        fontFamily: 'Consolas, Monaco, monospace',
        fontSize: 13, lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
    }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentModuleView() {
    const { id, moduleId } = useParams()
    const navigate = useNavigate()
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'
    const { user, authFetch } = useAuth()

    const course = COURSES.find(c => c.id === id)
    const moduleIndex = course ? course.modules.findIndex(m => m.id === moduleId) : -1
    const module = course?.modules[moduleIndex]

    // ── Progress state (read from localStorage, patched on actions) ──
    const [progressState, setProgressState] = useState(() => readProgress(user?.id))

    const refreshProgress = useCallback(() => {
        setProgressState(readProgress(user?.id))
    }, [user?.id])

    if (!course || !module || moduleIndex === -1) {
        return (
            <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: t.textSecondary }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>404</div>
                    <div style={{ fontSize: 14, marginBottom: 16 }}>Модуль не найден</div>
                    <Link to={`/student/courses/${id}`} style={{ color: accent, fontSize: 13 }}>
                        Вернуться к курсу
                    </Link>
                </div>
            </div>
        )
    }

    const mp = getModuleProgress(progressState, course.id, module.id)

    const [activeStep, setActiveStep] = useState(() => getDefaultStep(mp))

    // Reset step and progress when navigating to a different module
    useEffect(() => {
        const prog = readProgress(user?.id)
        setProgressState(prog)
        setActiveStep(getDefaultStep(getModuleProgress(prog, course.id, module.id)))
    }, [moduleId]) // eslint-disable-line

    // ── Patch helpers ──

    function handleLectureDone() {
        const updated = patchModuleProgress(user?.id, course.id, module.id, { lectureRead: true })
        setProgressState(updated)
        setActiveStep('quiz')
    }

    function handleQuizPass(score) {
        const updated = patchModuleProgress(user?.id, course.id, module.id, { quizPassed: true, quizScore: score })
        setProgressState(updated)
        setActiveStep('practical')
    }

    function handlePracticalDone() {
        const updated = patchModuleProgress(user?.id, course.id, module.id, { practicalDone: true })
        setProgressState(updated)
    }

    function goToNextModule() {
        const nextIdx = moduleIndex + 1
        if (nextIdx < course.modules.length) {
            navigate(`/student/courses/${course.id}/module/${course.modules[nextIdx].id}`)
        }
    }

    // ── Determine step accessibility ──
    const canAccessQuiz = mp.lectureRead
    const canAccessPractical = mp.quizPassed
    const isLastModule = moduleIndex === course.modules.length - 1

    // ── Navigate to another module ──
    function goToModule(idx) {
        const locked = isModuleLocked(progressState, course.id, course.modules, idx)
        if (locked) return
        const targetModule = course.modules[idx]
        navigate(`/student/courses/${course.id}/module/${targetModule.id}`)
    }

    // ── Step tab style ──
    function tabStyle(key, accessible) {
        const isActive = activeStep === key
        return {
            padding: '10px 18px', fontSize: 13,
            cursor: accessible ? 'pointer' : 'not-allowed',
            border: 'none', background: 'transparent',
            color: !accessible
                ? t.textSecondary
                : isActive ? accent : t.textSecondary,
            borderBottom: isActive ? `2px solid ${accent}` : '2px solid transparent',
            fontWeight: isActive ? 500 : 400,
            opacity: !accessible ? 0.45 : 1,
            transition: 'all 0.12s',
        }
    }

    return (
        <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Topbar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 22px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Link to="/student/courses" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>
                        Курсы
                    </Link>
                    <span style={{ color: t.textSecondary, fontSize: 12 }}>/</span>
                    <Link to={`/student/courses/${course.id}`} style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>
                        {course.title}
                    </Link>
                    <span style={{ color: t.textSecondary, fontSize: 12 }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{module.title}</span>
                </div>
                <ThemeToggle />
            </div>

            {/* Body: left panel + right content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left module list panel */}
                <div style={{
                    width: 240, minWidth: 240, flexShrink: 0,
                    background: isDark ? '#13141F' : '#fff',
                    borderRight: `1px solid ${t.border}`,
                    display: 'flex', flexDirection: 'column',
                    overflowY: 'auto',
                }}>
                    <div style={{
                        padding: '12px 14px 8px',
                        fontSize: 10, color: t.textSecondary,
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                        borderBottom: `1px solid ${t.border}`,
                    }}>
                        Модули
                    </div>

                    {course.modules.map((m, idx) => {
                        const locked = isModuleLocked(progressState, course.id, course.modules, idx)
                        const mProgress = getModuleProgress(progressState, course.id, m.id)
                        const isActive = m.id === moduleId
                        const done = mProgress.practicalDone

                        return (
                            <div
                                key={m.id}
                                onClick={() => goToModule(idx)}
                                title={locked ? 'Завершите предыдущий модуль' : undefined}
                                style={{
                                    padding: '10px 14px',
                                    cursor: locked ? 'not-allowed' : 'pointer',
                                    background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                    borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                                    opacity: locked ? 0.5 : 1,
                                    display: 'flex', alignItems: 'center', gap: 9,
                                    transition: 'background 0.12s',
                                    borderBottom: `1px solid ${t.border}`,
                                }}
                                onMouseEnter={e => {
                                    if (!locked && !isActive) e.currentTarget.style.background = isDark ? '#1A2030' : '#F4F7FF'
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) e.currentTarget.style.background = 'transparent'
                                }}
                            >
                                <div style={{
                                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                    background: locked
                                        ? (isDark ? '#2A2D3E' : '#E2E8F0')
                                        : done
                                            ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                            : isActive
                                                ? (isDark ? '#1E3A5F' : '#EBF4FF')
                                                : (isDark ? '#2A2D3E' : '#F4F6FA'),
                                    color: locked ? t.textSecondary : done ? (isDark ? '#A6E3A1' : '#276749') : accent,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700,
                                }}>
                                    {locked ? '🔒' : done ? '✓' : idx + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 12, fontWeight: isActive ? 600 : 400,
                                        color: isActive ? accent : t.text,
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {m.title}
                                    </div>
                                    <div style={{ display: 'flex', gap: 5, marginTop: 2 }}>
                                        <StepDot done={mProgress.lectureRead} isDark={isDark} />
                                        <StepDot done={mProgress.quizPassed} isDark={isDark} />
                                        <StepDot done={mProgress.practicalDone} isDark={isDark} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Right: step tabs + content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Step tabs */}
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        background: isDark ? '#13141F' : '#fff',
                        borderBottom: `1px solid ${t.border}`,
                        paddingLeft: 8, flexShrink: 0,
                    }}>
                        <button
                            style={tabStyle('lecture', true)}
                            onClick={() => setActiveStep('lecture')}
                        >
                            📖 Лекция {mp.lectureRead ? '✓' : ''}
                        </button>
                        <button
                            style={tabStyle('quiz', canAccessQuiz)}
                            onClick={() => canAccessQuiz && setActiveStep('quiz')}
                        >
                            📝 Тест {mp.quizPassed ? '✓' : ''}
                        </button>
                        <button
                            style={tabStyle('practical', canAccessPractical)}
                            onClick={() => canAccessPractical && setActiveStep('practical')}
                        >
                            💻 Практика {mp.practicalDone ? '✓' : ''}
                        </button>
                    </div>

                    {/* Content area */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {activeStep === 'lecture' && (
                            <LectureView
                                module={module}
                                t={t}
                                isDark={isDark}
                                accent={accent}
                                onDone={handleLectureDone}
                            />
                        )}
                        {activeStep === 'quiz' && (
                            <QuizView
                                key={module.id}
                                module={module}
                                t={t}
                                isDark={isDark}
                                accent={accent}
                                onPass={handleQuizPass}
                            />
                        )}
                        {activeStep === 'practical' && (
                            <PracticalView
                                key={module.id}
                                module={module}
                                t={t}
                                isDark={isDark}
                                accent={accent}
                                authFetch={authFetch}
                                practicalDone={mp.practicalDone}
                                onDone={handlePracticalDone}
                                isLastModule={isLastModule}
                                onNextModule={!isLastModule ? goToNextModule : null}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StepDot({ done, isDark }) {
    return (
        <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: done
                ? (isDark ? '#A6E3A1' : '#38A169')
                : (isDark ? '#2A2D3E' : '#E2E8F0'),
        }} />
    )
}
