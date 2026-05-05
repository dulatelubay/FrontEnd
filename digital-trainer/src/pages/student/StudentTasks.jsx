// src/pages/student/StudentTasks.jsx

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'
import { useAuth } from '../../context/AuthContext'

// ─── Утилиты ──────────────────────────────────────────────────────────────────

const STATUS = {
    graded:    { label: 'Проверено',   bgL: '#E6FFEE', cL: '#276749', bgD: '#1A3A2A', cD: '#A6E3A1' },
    ai_graded: { label: 'Оценено ИИ', bgL: '#F3F0FF', cL: '#553C9A', bgD: '#2D1B69', cD: '#CBA6F7' },
    pending:   { label: 'На проверке', bgL: '#FFFBEB', cL: '#975A16', bgD: '#3A2E10', cD: '#F9E2AF' },
    new:       { label: 'Новое',       bgL: '#EBF4FF', cL: '#1A6EFF', bgD: '#1E3A5F', cD: '#89B4FA' },
}

const LEVEL = {
    'Базовый':     { bgL: '#E6FFEE', cL: '#276749', bgD: '#1A3A2A', cD: '#A6E3A1' },
    'Средний':     { bgL: '#FFFBEB', cL: '#975A16', bgD: '#3A2E10', cD: '#F9E2AF' },
    'Продвинутый': { bgL: '#FFF5F5', cL: '#C53030', bgD: '#2E1A3A', cD: '#CBA6F7' },
}

function Pill({ config, isDark, text }) {
    return (
        <span style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 5, fontWeight: 500,
            background: isDark ? config.bgD : config.bgL,
            color: isDark ? config.cD : config.cL,
        }}>{text}</span>
    )
}

function getScoreColor(score, isDark) {
    if (score >= 80) return isDark ? '#A6E3A1' : '#276749'
    if (score >= 60) return isDark ? '#F9E2AF' : '#975A16'
    return isDark ? '#F28B82' : '#C53030'
}

// ─── Панель задания ───────────────────────────────────────────────────────────

function TaskPanel({ task, t, isDark, accent, authFetch, onSubmitted }) {
    const [code, setCode]             = useState(task.myCode || '')
    const [tab, setTab]               = useState('task')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [polling, setPolling]       = useState(false)
    const [pollTimedOut, setPollTimedOut] = useState(false)
    const [hintLoading, setHintLoading] = useState(false)
    const [hint, setHint]             = useState(null)
    const [hintNextAction, setHintNextAction] = useState('')

    // Auto-start polling if this task is already pending when the panel mounts
    useEffect(() => {
        if (task.status === 'pending') setPolling(true)
    }, []) // eslint-disable-line

    // Refs so interval callback always has latest values without re-creating the interval
    const authFetchRef   = useRef(authFetch)
    const onSubmittedRef = useRef(onSubmitted)
    authFetchRef.current   = authFetch
    onSubmittedRef.current = onSubmitted

    useEffect(() => {
        if (!polling) return
        setPollTimedOut(false)

        const iv = setInterval(async () => {
            try {
                const r = await authFetchRef.current('/api/submissions/my')
                if (!r.ok) return
                const subs = await r.json()
                const sub  = subs.find(s => s.taskId === task.id)
                if (sub && sub.status !== 'pending') {
                    clearInterval(iv)
                    setPolling(false)
                    onSubmittedRef.current(task.id, sub)
                    setTab('feedback')
                }
            } catch {}
        }, 4000)

        const timeout = setTimeout(() => {
            clearInterval(iv)
            setPolling(false)
            setPollTimedOut(true)
        }, 90000)

        return () => { clearInterval(iv); clearTimeout(timeout) }
    }, [polling, task.id])

    async function handleSubmit() {
        if (!code.trim() || submitting) return
        setSubmitting(true)
        setSubmitError('')
        try {
            const r = await authFetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId: task.id, code }),
            })
            if (r.ok) {
                const data = await r.json()
                onSubmitted(task.id, data)
                setPolling(true)
            } else {
                const err = await r.json().catch(() => ({}))
                setSubmitError(err.error || 'Ошибка при сдаче работы')
            }
        } catch {
            setSubmitError('Нет связи с сервером')
        } finally {
            setSubmitting(false)
        }
    }

    async function requestHint() {
        if (hintLoading) return
        setHintLoading(true)
        setHint(null)
        try {
            const r = await authFetch(`/api/hints/${task.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            })
            if (r.ok) {
                const data = await r.json()
                setHint(data.hint)
                setHintNextAction(data.nextAction || '')
            } else {
                setHint('Не удалось получить подсказку. Попробуйте позже.')
            }
        } catch {
            setHint('Нет связи с сервером.')
        } finally {
            setHintLoading(false)
        }
    }

    const tabStyle = (key) => ({
        padding: '8px 16px', fontSize: 12, cursor: 'pointer',
        border: 'none', background: 'transparent',
        color: tab === key ? accent : t.textSecondary,
        borderBottom: tab === key ? `2px solid ${accent}` : '2px solid transparent',
        fontWeight: tab === key ? 500 : 400,
    })

    const MAX_ATTEMPTS = 5
    const canSubmit = task.status !== 'graded' && task.attempts < MAX_ATTEMPTS

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Заголовок */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <Pill config={STATUS[task.status]} isDark={isDark} text={STATUS[task.status].label} />
                    {LEVEL[task.level] && (
                        <Pill config={LEVEL[task.level]} isDark={isDark} text={task.level} />
                    )}
                    <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 5,
                        background: isDark ? '#181926' : '#F4F6FA',
                        color: t.textSecondary, border: `1px solid ${t.border}`,
                    }}>{task.topic}</span>
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>
                    {task.title}
                </h2>
                {task.grade != null && (
                    <div style={{
                        fontSize: 13, fontWeight: 700,
                        color: getScoreColor(task.grade, isDark),
                    }}>
                        Оценка: {task.grade}/100
                    </div>
                )}
            </div>

            {/* Табы */}
            <div style={{
                display: 'flex', borderBottom: `1px solid ${t.border}`,
                background: isDark ? '#13141F' : '#fff', paddingLeft: 8,
            }}>
                <button style={tabStyle('task')}   onClick={() => setTab('task')}>Задание</button>
                <button style={tabStyle('submit')} onClick={() => setTab('submit')}>
                    {polling ? '🔄 Проверяется...' : task.status === 'pending' ? '⏳ На проверке' : canSubmit ? 'Сдать работу' : 'Мой ответ'}
                </button>
                {(task.aiGrade != null || task.grade != null) && (
                    <button style={tabStyle('feedback')} onClick={() => setTab('feedback')}>
                        Обратная связь
                    </button>
                )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>

                {/* Описание задания */}
                {tab === 'task' && (
                    <div>
                        <p style={{ fontSize: 13, color: t.text, lineHeight: 1.7, marginBottom: 16 }}>
                            {task.description}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{
                                background: isDark ? '#181926' : '#F4F6FA',
                                border: `1px solid ${t.border}`,
                                borderRadius: 8, padding: 12,
                            }}>
                                <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Пример входных данных:</div>
                                <code style={{ fontSize: 12, color: isDark ? '#A6E3A1' : '#276749', fontFamily: 'monospace' }}>
                                    {task.exampleInput}
                                </code>
                            </div>
                            <div style={{
                                background: isDark ? '#181926' : '#F4F6FA',
                                border: `1px solid ${t.border}`,
                                borderRadius: 8, padding: 12,
                            }}>
                                <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Ожидаемый результат:</div>
                                <code style={{ fontSize: 12, color: isDark ? '#89B4FA' : '#1A6EFF', fontFamily: 'monospace' }}>
                                    {task.exampleOutput}
                                </code>
                            </div>
                        </div>
                        <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button
                                onClick={() => window.open('https://colab.research.google.com/drive/new', '_blank')}
                                style={{
                                    padding: '9px 18px', borderRadius: 8, fontSize: 12,
                                    background: '#F9AB00', color: '#fff', border: 'none',
                                    fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}
                            >
                                <span>▶</span> Решить в Google Colab
                            </button>
                            <button
                                onClick={requestHint}
                                disabled={hintLoading}
                                style={{
                                    padding: '9px 18px', borderRadius: 8, fontSize: 12,
                                    background: hintLoading ? t.border : (isDark ? '#2D1B69' : '#F3F0FF'),
                                    color: hintLoading ? t.textSecondary : (isDark ? '#CBA6F7' : '#553C9A'),
                                    border: `1px solid ${isDark ? '#4A3A7A' : '#C4B5FD'}`,
                                    fontWeight: 600, cursor: hintLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                            >
                                {hintLoading ? '...' : '💡'} {hintLoading ? 'Получение подсказки...' : 'Подсказка от ИИ'}
                            </button>
                        </div>

                        {/* Hint block */}
                        {hint && (
                            <div style={{
                                marginTop: 16, borderRadius: 10, overflow: 'hidden',
                                border: `1px solid ${isDark ? '#4A3A7A' : '#C4B5FD'}`,
                            }}>
                                <div style={{
                                    padding: '10px 14px',
                                    background: isDark ? '#2D1B69' : '#F3F0FF',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#CBA6F7' : '#553C9A' }}>
                                        💡 Подсказка от ИИ
                                    </span>
                                    <button onClick={() => setHint(null)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: isDark ? '#CBA6F7' : '#553C9A', fontSize: 16, lineHeight: 1,
                                    }}>×</button>
                                </div>
                                <div style={{ padding: '12px 14px', background: isDark ? '#181926' : '#fff' }}>
                                    <p style={{ fontSize: 13, color: t.text, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                                        {hint}
                                    </p>
                                    {hintNextAction && (
                                        <div style={{
                                            marginTop: 10, padding: '8px 12px', borderRadius: 7, fontSize: 12,
                                            background: isDark ? '#13141F' : '#EBF4FF',
                                            color: isDark ? '#89B4FA' : '#1A6EFF',
                                            border: `1px solid ${isDark ? '#1E3A5F' : '#BEE3F8'}`,
                                        }}>
                                            <strong>Следующий шаг:</strong> {hintNextAction}
                                        </div>
                                    )}
                                    <button onClick={requestHint} disabled={hintLoading} style={{
                                        marginTop: 10, fontSize: 12, padding: '5px 12px', borderRadius: 6,
                                        background: 'none', border: `1px solid ${isDark ? '#4A3A7A' : '#C4B5FD'}`,
                                        color: isDark ? '#CBA6F7' : '#553C9A',
                                        cursor: hintLoading ? 'not-allowed' : 'pointer',
                                    }}>
                                        {hintLoading ? 'Загрузка...' : '🔄 Другая подсказка'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Сдать / просмотреть ответ */}
                {tab === 'submit' && (
                    <div>
                        {/* ── Идёт проверка ИИ ── */}
                        {polling && (
                            <>
                                <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    padding: '32px 20px', gap: 14, textAlign: 'center',
                                    background: isDark ? '#1C1A2E' : '#F5F3FF',
                                    borderRadius: 12, border: `1px solid ${isDark ? '#4A3A7A' : '#C4B5FD'}`,
                                }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        border: `3px solid ${isDark ? '#4A3A7A' : '#C4B5FD'}`,
                                        borderTopColor: isDark ? '#CBA6F7' : '#7C3AED',
                                        animation: 'spin 1s linear infinite',
                                    }} />
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#CBA6F7' : '#553C9A', marginBottom: 6 }}>
                                            🤖 ИИ проверяет вашу работу...
                                        </div>
                                        <div style={{ fontSize: 12, color: t.textSecondary, animation: 'pulse 2s ease-in-out infinite' }}>
                                            Результат появится автоматически
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: 11, color: t.textSecondary,
                                        background: isDark ? '#13141F' : '#fff',
                                        border: `1px solid ${t.border}`,
                                        borderRadius: 8, padding: '8px 14px',
                                    }}>
                                        Не нужно перезагружать страницу
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Pending (загружено из БД, ИИ ещё не ответил или упал) ── */}
                        {!polling && task.status === 'pending' && (
                            <div style={{
                                padding: '18px 16px', borderRadius: 10, marginBottom: 12,
                                background: isDark ? '#3A2E10' : '#FFFBEB',
                                border: `1px solid ${isDark ? '#6B5A20' : '#F6E05E'}`,
                                display: 'flex', gap: 10, alignItems: 'flex-start',
                            }}>
                                <span style={{ fontSize: 18 }}>⏳</span>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#F9E2AF' : '#744210', marginBottom: 3 }}>
                                        Работа сдана — ожидаем проверки ИИ
                                    </div>
                                    <div style={{ fontSize: 12, color: isDark ? '#D4A853' : '#975A16' }}>
                                        Вы можете сдать улучшенную версию или подождать результата.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Тайм-аут опроса ── */}
                        {pollTimedOut && (
                            <div style={{
                                padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 12,
                                background: isDark ? '#1E1F2E' : '#EEF2FF',
                                color: t.textSecondary,
                            }}>
                                ИИ не ответил вовремя. Результат появится позже — обновите страницу.
                            </div>
                        )}

                        {/* ── Редактор кода ── */}
                        {!polling && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ fontSize: 12, color: t.textSecondary }}>
                                        {canSubmit ? 'Вставь свой код и нажми "Сдать":' : 'Твой сданный код:'}
                                    </span>
                                    {task.attempts > 0 && (
                                        <span style={{
                                            fontSize: 11, fontWeight: 500,
                                            color: task.attempts >= MAX_ATTEMPTS
                                                ? (isDark ? '#F28B82' : '#C53030')
                                                : t.textSecondary,
                                        }}>
                                            Попытка {task.attempts} из {MAX_ATTEMPTS}
                                        </span>
                                    )}
                                </div>
                                <textarea
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    readOnly={!canSubmit}
                                    placeholder="# Напишите или вставьте ваш код здесь..."
                                    style={{
                                        width: '100%', minHeight: 220,
                                        padding: '12px 14px',
                                        borderRadius: 10, fontSize: 12,
                                        border: `1px solid ${t.border}`,
                                        background: isDark ? '#11111B' : '#1A202C',
                                        color: '#CDD6F4',
                                        fontFamily: 'monospace', lineHeight: 1.7,
                                        outline: 'none', resize: 'vertical',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                {submitError && (
                                    <div style={{ fontSize: 12, color: isDark ? '#F28B82' : '#C53030', marginTop: 6 }}>
                                        {submitError}
                                    </div>
                                )}
                                {!canSubmit && task.status !== 'graded' && (
                                    <div style={{ fontSize: 12, color: isDark ? '#F28B82' : '#C53030', marginTop: 8 }}>
                                        Достигнут лимит попыток ({MAX_ATTEMPTS}/{MAX_ATTEMPTS}). Ожидайте проверку учителя.
                                    </div>
                                )}
                                {canSubmit && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!code.trim() || submitting}
                                        style={{
                                            marginTop: 12,
                                            padding: '9px 24px', borderRadius: 8, fontSize: 13,
                                            background: !code.trim() || submitting ? t.border : accent,
                                            color: !code.trim() || submitting ? t.textSecondary : '#fff',
                                            border: 'none', fontWeight: 500,
                                            cursor: code.trim() && !submitting ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        {submitting ? 'Отправка...' : '📤 Сдать работу'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Обратная связь */}
                {tab === 'feedback' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                        {/* Оценка учителя */}
                        {task.grade != null && (
                            <div style={{
                                borderRadius: 10, overflow: 'hidden',
                                border: `1px solid ${isDark ? '#2A5A3A' : '#9AE6B4'}`,
                            }}>
                                <div style={{
                                    padding: '10px 16px',
                                    background: isDark ? '#1A3A2A' : '#E6FFEE',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#A6E3A1' : '#276749' }}>
                                        ✅ Оценка учителя
                                    </span>
                                    <span style={{ fontSize: 22, fontWeight: 700, color: getScoreColor(task.grade, isDark), marginLeft: 'auto' }}>
                                        {task.grade}<span style={{ fontSize: 12, fontWeight: 400, color: t.textSecondary }}>/100</span>
                                    </span>
                                </div>
                                {task.feedback && (
                                    <div style={{ padding: '12px 16px', background: isDark ? '#181926' : '#fff' }}>
                                        <p style={{ fontSize: 13, color: t.text, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                                            {task.feedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Оценка ИИ */}
                        {task.aiGrade != null && (
                            <div style={{
                                borderRadius: 10, overflow: 'hidden',
                                border: `1px solid ${isDark ? '#4A3A7A' : '#C4B5FD'}`,
                            }}>
                                <div style={{
                                    padding: '10px 16px',
                                    background: isDark ? '#2D1B69' : '#F3F0FF',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#CBA6F7' : '#553C9A' }}>
                                        🤖 Оценка ИИ
                                    </span>
                                    {task.grade != null && (
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>(до проверки учителем)</span>
                                    )}
                                    <span style={{ fontSize: 22, fontWeight: 700, color: getScoreColor(task.aiGrade, isDark), marginLeft: 'auto' }}>
                                        {task.aiGrade}<span style={{ fontSize: 12, fontWeight: 400, color: t.textSecondary }}>/100</span>
                                    </span>
                                </div>
                                {task.aiFeedback && (
                                    <div style={{ padding: '12px 16px', background: isDark ? '#181926' : '#fff' }}>
                                        <p style={{ fontSize: 13, color: t.text, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                                            {task.aiFeedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {task.aiGrade == null && task.grade == null && task.status !== 'pending' && (
                            <p style={{ fontSize: 13, color: t.textSecondary }}>Оценок пока нет.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function StudentTasks() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'
    const { authFetch } = useAuth()

    const [tasks, setTasks]       = useState([])
    const [selected, setSelected] = useState(null)
    const [filter, setFilter]     = useState('all')
    const [loading, setLoading]   = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const [tasksRes, subsRes] = await Promise.all([
                    authFetch('/api/tasks'),
                    authFetch('/api/submissions/my'),
                ])
                const tasksData = await tasksRes.json()
                const subsData  = await subsRes.json()

                const subMap = {}
                subsData.forEach(s => { subMap[s.taskId] = s })

                const merged = tasksData.map(task => {
                    const sub = subMap[task.id]
                    return {
                        id:          task.id,
                        title:       task.title,
                        topic:       task.topic,
                        level:       task.level,
                        description: task.description,
                        exampleInput:  task.exampleInput,
                        exampleOutput: task.exampleOutput,
                        status:       sub?.status || 'new',
                        grade:        sub?.grade    ?? null,
                        feedback:     sub?.feedback  || '',
                        aiGrade:      sub?.aiGrade   ?? null,
                        aiFeedback:   sub?.aiFeedback || '',
                        myCode:       sub?.submittedCode || '',
                        submissionId: sub?.id || null,
                        attempts:     sub?.attempts ?? 0,
                    }
                })

                setTasks(merged)
                if (merged.length > 0) setSelected(merged[0])
            } catch {
                // silently fail — error boundary handles uncaught errors
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    function onSubmitted(taskId, sub) {
        const patch = {
            submissionId: sub.id,
            status:       sub.status,
            myCode:       sub.submittedCode,
            attempts:     sub.attempts,
            aiGrade:      sub.aiGrade   ?? null,
            aiFeedback:   sub.aiFeedback || '',
            grade:        sub.grade      ?? null,
            feedback:     sub.feedback   || '',
        }
        setTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...patch } : task))
        setSelected(prev => prev?.id === taskId ? { ...prev, ...patch } : prev)
    }

    const isGraded = s => s === 'graded' || s === 'ai_graded'

    const filtered = tasks.filter(task =>
        filter === 'all' ||
        task.status === filter ||
        (filter === 'graded' && isGraded(task.status))
    )

    const counts = {
        all:     tasks.length,
        new:     tasks.filter(t => t.status === 'new').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        graded:  tasks.filter(t => isGraded(t.status)).length,
    }

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Topbar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 22px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Link to="/student" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>Главная</Link>
                    <span style={{ color: t.textSecondary }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Мои задания</span>
                </div>
                <ThemeToggle />
            </div>

            {loading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textSecondary, fontSize: 14 }}>
                    Загрузка...
                </div>
            ) : (
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* Левая панель */}
                    <div style={{
                        width: 290, minWidth: 290,
                        background: isDark ? '#13141F' : '#fff',
                        borderRight: `1px solid ${t.border}`,
                        display: 'flex', flexDirection: 'column',
                    }}>
                        {/* Фильтры */}
                        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {[
                                { key: 'all',     label: 'Все' },
                                { key: 'new',     label: 'Новые' },
                                { key: 'pending', label: 'На проверке' },
                                { key: 'graded',  label: 'Проверено' },
                            ].map(f => (
                                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                                    padding: '5px 10px', borderRadius: 7, fontSize: 11,
                                    border: `1px solid ${filter === f.key ? accent : t.border}`,
                                    background: filter === f.key ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                    color: filter === f.key ? accent : t.textSecondary,
                                    cursor: 'pointer', fontWeight: filter === f.key ? 500 : 400,
                                }}>
                                    {f.label} ({counts[f.key]})
                                </button>
                            ))}
                        </div>

                        {/* Список */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {filtered.length === 0 ? (
                                <div style={{ padding: 20, textAlign: 'center', color: t.textSecondary, fontSize: 13 }}>
                                    Заданий не найдено
                                </div>
                            ) : filtered.map(task => {
                                const isActive = selected?.id === task.id
                                const s = STATUS[task.status]
                                return (
                                    <div key={task.id} onClick={() => setSelected(task)} style={{
                                        padding: '12px 16px',
                                        borderBottom: `1px solid ${t.border}`,
                                        cursor: 'pointer',
                                        background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                        borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                                        transition: 'all 0.12s',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <span style={{
                                                fontSize: 13, fontWeight: isActive ? 500 : 400,
                                                color: isActive ? accent : t.text, flex: 1, marginRight: 8,
                                            }}>
                                                {task.title}
                                            </span>
                                            <Pill config={s} isDark={isDark} text={s.label} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 11, color: t.textSecondary }}>{task.topic}</span>
                                            {task.grade != null && (
                                                <span style={{ fontSize: 12, fontWeight: 700, color: getScoreColor(task.grade, isDark) }}>
                                                    {task.grade}/100
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Правая панель */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        {selected ? (
                            <TaskPanel
                                key={selected.id}
                                task={selected}
                                t={t}
                                isDark={isDark}
                                accent={accent}
                                authFetch={authFetch}
                                onSubmitted={onSubmitted}
                            />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textSecondary }}>
                                Выбери задание
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
