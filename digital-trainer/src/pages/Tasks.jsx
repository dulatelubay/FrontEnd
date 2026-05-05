// src/pages/Tasks.jsx
// Страница заданий — Цифровой тренажёр для учителей информатики

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

// ─── Данные (теперь загружаются из API) ──────────────────────────────────────

const _UNUSED_allTasks = [
    {
        id: 1,
        title: 'Найти максимум в списке',
        topic: 'Алгоритмы',
        level: 'Базовый',
        status: 'graded',
        grade: 95,
        description: 'Напишите функцию которая принимает список чисел и возвращает максимальное значение без использования встроенной функции max().',
        example_input: '[3, 7, 1, 9, 4]',
        example_output: '9',
        solution: `def найти_максимум(список):
    максимум = список[0]
    for элемент in список:
        if элемент > максимум:
            максимум = элемент
    return максимум`,
        submitted_code: `def найти_максимум(список):
    максимум = список[0]
    for элемент in список:
        if элемент > максимум:
            максимум = элемент
    return максимум

print(найти_максимум([3, 7, 1, 9, 4]))`,
        feedback: 'Отличное решение! Правильно используется итерация и сравнение.',
        student: 'Алия Муратова',
    },
    {
        id: 2,
        title: 'Определить тип переменной',
        topic: 'Типы данных',
        level: 'Базовый',
        status: 'graded',
        grade: 80,
        description: 'Создайте функцию которая принимает переменную и возвращает строку с описанием её типа на русском языке.',
        example_input: '42',
        example_output: '"целое число"',
        solution: `def тип_переменной(x):
    if isinstance(x, bool):
        return "булево значение"
    elif isinstance(x, int):
        return "целое число"
    elif isinstance(x, float):
        return "дробное число"
    elif isinstance(x, str):
        return "строка"
    else:
        return "неизвестный тип"`,
        submitted_code: `def тип_переменной(x):
    if type(x) == int:
        return "целое число"
    elif type(x) == float:
        return "дробное число"
    elif type(x) == str:
        return "строка"`,
        feedback: 'Хорошо, но использование isinstance() предпочтительнее type() == . Также не обработан тип bool.',
        student: 'Данияр Касымов',
    },
    {
        id: 3,
        title: 'Подсчёт чётных чисел',
        topic: 'Условия и циклы',
        level: 'Базовый',
        status: 'pending',
        grade: null,
        description: 'Напишите программу которая принимает список чисел и возвращает количество чётных чисел в нём.',
        example_input: '[1, 2, 3, 4, 5, 6]',
        example_output: '3',
        solution: `def подсчёт_чётных(список):
    count = 0
    for число in список:
        if число % 2 == 0:
            count += 1
    return count`,
        submitted_code: `def подсчёт_чётных(список):
    count = 0
    for число in список:
        if число % 2 == 0:
            count += 1
    return count`,
        feedback: '',
        student: 'Зарина Нурланова',
    },
    {
        id: 4,
        title: 'Калькулятор с функциями',
        topic: 'Функции',
        level: 'Средний',
        status: 'pending',
        grade: null,
        description: 'Создайте простой калькулятор с функциями для сложения, вычитания, умножения и деления. Функция деления должна обрабатывать деление на ноль.',
        example_input: 'сложить(10, 5)',
        example_output: '15',
        solution: `def сложить(a, b): return a + b
def вычесть(a, b): return a - b
def умножить(a, b): return a * b
def разделить(a, b):
    if b == 0:
        return "Ошибка: деление на ноль"
    return a / b`,
        submitted_code: `def сложить(a, b):
    return a + b

def вычесть(a, b):
    return a - b

def умножить(a, b):
    return a * b

def разделить(a, b):
    if b == 0:
        return "Ошибка!"
    return a / b`,
        feedback: '',
        student: 'Бекзат Сейткали',
    },
    {
        id: 5,
        title: 'Разворот списка',
        topic: 'Массивы и списки',
        level: 'Средний',
        status: 'new',
        grade: null,
        description: 'Напишите функцию которая разворачивает список без использования встроенного метода reverse() или среза [::-1].',
        example_input: '[1, 2, 3, 4, 5]',
        example_output: '[5, 4, 3, 2, 1]',
        solution: `def развернуть(список):
    результат = []
    for i in range(len(список) - 1, -1, -1):
        результат.append(список[i])
    return результат`,
        submitted_code: '',
        feedback: '',
        student: '',
    },
    {
        id: 6,
        title: 'Класс "Прямоугольник"',
        topic: 'ООП — основы',
        level: 'Продвинутый',
        status: 'new',
        grade: null,
        description: 'Создайте класс Прямоугольник с атрибутами ширина и высота, и методами для вычисления площади и периметра.',
        example_input: 'Прямоугольник(4, 5)',
        example_output: 'площадь: 20, периметр: 18',
        solution: `class Прямоугольник:
    def __init__(self, ширина, высота):
        self.ширина = ширина
        self.высота = высота
    
    def площадь(self):
        return self.ширина * self.высота
    
    def периметр(self):
        return 2 * (self.ширина + self.высота)`,
        submitted_code: '',
        feedback: '',
        student: '',
    },
    {
        id: 7,
        title: 'Факториал рекурсией',
        topic: 'Рекурсия',
        level: 'Продвинутый',
        status: 'new',
        grade: null,
        description: 'Реализуйте функцию вычисления факториала числа с помощью рекурсии. Добавьте проверку на отрицательные числа.',
        example_input: '5',
        example_output: '120',
        solution: `def факториал(n):
    if n < 0:
        return "Ошибка: отрицательное число"
    if n == 0 or n == 1:
        return 1
    return n * факториал(n - 1)`,
        submitted_code: '',
        feedback: '',
        student: '',
    },
]

// ─── Константы ────────────────────────────────────────────────────────────────

const LEVEL_COLORS = {
    'Базовый':     { bgLight: '#E6FFEE', colorLight: '#276749', bgDark: '#1A3A2A', colorDark: '#A6E3A1' },
    'Средний':     { bgLight: '#FFFBEB', colorLight: '#975A16', bgDark: '#3A2E10', colorDark: '#F9E2AF' },
    'Продвинутый': { bgLight: '#FFF5F5', colorLight: '#C53030', bgDark: '#2E1A3A', colorDark: '#CBA6F7' },
}

// ─── Вспомогательные компоненты ───────────────────────────────────────────────

function LevelPill({ level, isDark }) {
    const c = LEVEL_COLORS[level]
    return (
        <span style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 5, fontWeight: 500,
            background: isDark ? c.bgDark : c.bgLight,
            color: isDark ? c.colorDark : c.colorLight,
        }}>
      {level}
    </span>
    )
}

// ─── Панель детали задания ────────────────────────────────────────────────────

function TaskDetail({ task, t, isDark, accent, authFetch }) {
    const [activeTab, setActiveTab]         = useState('description')
    const [submissions, setSubmissions]     = useState([])
    const [loadingSubs, setLoadingSubs]     = useState(false)
    const [activeSub, setActiveSub]         = useState(null)
    const [feedback, setFeedback]           = useState('')
    const [grade, setGrade]                 = useState('')
    const [saving, setSaving]               = useState(false)
    const [saved, setSaved]                 = useState(false)
    const [saveError, setSaveError]         = useState('')

    useEffect(() => {
        if (activeTab !== 'submissions') return
        setLoadingSubs(true)
        authFetch(`/api/submissions/task/${task.id}`)
            .then(r => r.json())
            .then(data => {
                setSubmissions(data)
                if (data.length > 0) {
                    setActiveSub(data[0])
                    setFeedback(data[0].feedback || '')
                    setGrade(data[0].grade ?? '')
                }
            })
            .catch(() => {})
            .finally(() => setLoadingSubs(false))
    }, [activeTab, task.id])

    function selectSub(sub) {
        setActiveSub(sub)
        setFeedback(sub.feedback || '')
        setGrade(sub.grade ?? sub.aiGrade ?? '')
        setSaved(false)
        setSaveError('')
    }

    async function handleSave() {
        if (!activeSub || saving) return
        const g = parseInt(grade, 10)
        if (isNaN(g) || g < 0 || g > 100) {
            setSaveError('Оценка должна быть числом от 0 до 100')
            return
        }
        setSaving(true)
        setSaveError('')
        try {
            const r = await authFetch(`/api/submissions/${activeSub.id}/grade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade: g, feedback }),
            })
            if (r.ok) {
                setSubmissions(prev => prev.map(s =>
                    s.id === activeSub.id ? { ...s, grade: g, feedback, status: 'graded' } : s
                ))
                setActiveSub(prev => ({ ...prev, grade: g, feedback, status: 'graded' }))
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            } else {
                setSaveError('Не удалось сохранить')
            }
        } catch {
            setSaveError('Нет связи с сервером')
        } finally {
            setSaving(false)
        }
    }

    const tabStyle = (tab) => ({
        padding: '7px 14px',
        fontSize: 12,
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        color: activeTab === tab ? accent : t.textSecondary,
        borderBottom: activeTab === tab ? `2px solid ${accent}` : '2px solid transparent',
        fontWeight: activeTab === tab ? 500 : 400,
        transition: 'all 0.12s',
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Заголовок */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <LevelPill level={task.level} isDark={isDark} />
                    <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 5,
                        background: isDark ? '#181926' : '#F4F6FA',
                        color: t.textSecondary, border: `1px solid ${t.border}`,
                    }}>
                        {task.topic}
                    </span>
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>
                    {task.title}
                </h2>
            </div>

            {/* Табы */}
            <div style={{
                display: 'flex',
                borderBottom: `1px solid ${t.border}`,
                background: isDark ? '#13141F' : '#fff',
                paddingLeft: 8,
            }}>
                <button style={tabStyle('description')} onClick={() => setActiveTab('description')}>
                    Задание
                </button>
                <button style={tabStyle('submissions')} onClick={() => setActiveTab('submissions')}>
                    Ответы учеников
                </button>
                <button style={tabStyle('solution')} onClick={() => setActiveTab('solution')}>
                    Решение
                </button>
            </div>

            {/* Контент таба */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>

                {activeTab === 'description' && (
                    <div>
                        <p style={{ fontSize: 13, color: t.text, lineHeight: 1.7, marginBottom: 16 }}>
                            {task.description}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                            <div style={{
                                background: isDark ? '#181926' : '#F4F6FA',
                                border: `1px solid ${t.border}`,
                                borderRadius: 8, padding: 12,
                            }}>
                                <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Пример входных данных:</div>
                                <code style={{
                                    fontSize: 12, color: isDark ? '#A6E3A1' : '#276749',
                                    fontFamily: 'monospace',
                                }}>
                                    {task.exampleInput}
                                </code>
                            </div>
                            <div style={{
                                background: isDark ? '#181926' : '#F4F6FA',
                                border: `1px solid ${t.border}`,
                                borderRadius: 8, padding: 12,
                            }}>
                                <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Ожидаемый результат:</div>
                                <code style={{
                                    fontSize: 12, color: isDark ? '#89B4FA' : '#1A6EFF',
                                    fontFamily: 'monospace',
                                }}>
                                    {task.exampleOutput}
                                </code>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div>
                        {loadingSubs ? (
                            <div style={{ color: t.textSecondary, fontSize: 13 }}>Загрузка...</div>
                        ) : submissions.length === 0 ? (
                            <div style={{ color: t.textSecondary, fontSize: 13 }}>Пока нет сданных работ</div>
                        ) : (
                            <div style={{ display: 'flex', gap: 16 }}>
                                {/* Список учеников */}
                                <div style={{ width: 180, flexShrink: 0 }}>
                                    {submissions.map(sub => {
                                        const isActive = activeSub?.id === sub.id
                                        const statusCfg = {
                                            graded:    { bg: isDark ? '#1A3A2A' : '#E6FFEE', color: isDark ? '#A6E3A1' : '#276749' },
                                            ai_graded: { bg: isDark ? '#2D1B69' : '#F3F0FF', color: isDark ? '#CBA6F7' : '#553C9A' },
                                            pending:   { bg: isDark ? '#3A2E10' : '#FFFBEB', color: isDark ? '#F9E2AF' : '#975A16' },
                                        }[sub.status] || { bg: t.border, color: t.textSecondary }
                                        return (
                                            <div
                                                key={sub.id}
                                                onClick={() => selectSub(sub)}
                                                style={{
                                                    padding: '10px 12px', marginBottom: 6,
                                                    borderRadius: 8, cursor: 'pointer',
                                                    background: isActive
                                                        ? (isDark ? '#1E3A5F' : '#EBF4FF')
                                                        : (isDark ? '#181926' : '#F4F6FA'),
                                                    border: `1px solid ${isActive ? accent : t.border}`,
                                                }}
                                            >
                                                <div style={{ fontSize: 12, fontWeight: 500, color: isActive ? accent : t.text, marginBottom: 4 }}>
                                                    {sub.studentName}
                                                </div>
                                                <span style={{
                                                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                                                    background: statusCfg.bg, color: statusCfg.color,
                                                }}>
                                                    {sub.status === 'graded' ? `✅ ${sub.grade}/100` : sub.status === 'ai_graded' ? `🤖 ${sub.aiGrade}/100` : 'На проверке'}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Код + форма оценки */}
                                {activeSub && (
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            background: isDark ? '#11111B' : '#1A202C',
                                            borderRadius: 10, padding: '14px 16px', marginBottom: 14,
                                        }}>
                                            <div style={{ fontSize: 10, color: '#A6ADC8', marginBottom: 8 }}>
                                                Python — {activeSub.studentName}
                                            </div>
                                            <pre style={{
                                                fontFamily: 'monospace', fontSize: 12,
                                                color: '#CDD6F4', margin: 0,
                                                overflowX: 'auto', lineHeight: 1.7,
                                                maxHeight: 200, overflow: 'auto',
                                            }}>
                                                {activeSub.submittedCode || '(пусто)'}
                                            </pre>
                                        </div>

                                        {/* Оценка ИИ (справка) */}
                                        {activeSub.aiGrade != null && (
                                            <div style={{
                                                borderRadius: 10, overflow: 'hidden', marginBottom: 14,
                                                border: `1px solid ${isDark ? '#4A3A7A' : '#C4B5FD'}`,
                                            }}>
                                                <div style={{
                                                    padding: '8px 14px',
                                                    background: isDark ? '#2D1B69' : '#F3F0FF',
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                }}>
                                                    <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#CBA6F7' : '#553C9A', flex: 1 }}>
                                                        🤖 ИИ предлагает: {activeSub.aiGrade}/100
                                                    </span>
                                                    <button
                                                        onClick={() => { setGrade(activeSub.aiGrade); setFeedback(activeSub.aiFeedback || '') }}
                                                        style={{
                                                            fontSize: 11, padding: '3px 10px', borderRadius: 5,
                                                            border: `1px solid ${isDark ? '#CBA6F7' : '#553C9A'}`,
                                                            background: 'transparent',
                                                            color: isDark ? '#CBA6F7' : '#553C9A',
                                                            cursor: 'pointer', fontWeight: 500,
                                                        }}
                                                    >
                                                        Применить
                                                    </button>
                                                </div>
                                                {activeSub.aiFeedback && (
                                                    <div style={{ padding: '8px 14px', background: isDark ? '#181926' : '#fff' }}>
                                                        <p style={{ fontSize: 12, color: t.textSecondary, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                                            {activeSub.aiFeedback}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Форма оценки */}
                                        <div style={{
                                            background: isDark ? '#181926' : '#fff',
                                            border: `1px solid ${t.border}`,
                                            borderRadius: 10, padding: 16,
                                        }}>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>
                                                ✏️ Поставить оценку
                                            </div>
                                            <div style={{ marginBottom: 10 }}>
                                                <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Оценка (0–100)</div>
                                                <input
                                                    type="number" min="0" max="100"
                                                    value={grade}
                                                    onChange={e => setGrade(e.target.value)}
                                                    placeholder="85"
                                                    style={{
                                                        width: 100, padding: '8px 12px',
                                                        borderRadius: 7, fontSize: 13,
                                                        border: `1px solid ${t.border}`,
                                                        background: isDark ? '#1E1F2E' : '#F4F6FA',
                                                        color: t.text, outline: 'none',
                                                    }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: 12 }}>
                                                <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Комментарий</div>
                                                <textarea
                                                    value={feedback}
                                                    onChange={e => setFeedback(e.target.value)}
                                                    placeholder="Напишите комментарий к решению..."
                                                    rows={3}
                                                    style={{
                                                        width: '100%', padding: '8px 12px',
                                                        borderRadius: 7, fontSize: 12,
                                                        border: `1px solid ${t.border}`,
                                                        background: isDark ? '#1E1F2E' : '#F4F6FA',
                                                        color: t.text, outline: 'none',
                                                        resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
                                                        boxSizing: 'border-box',
                                                    }}
                                                />
                                            </div>
                                            {saveError && (
                                                <div style={{ fontSize: 12, color: isDark ? '#F28B82' : '#C53030', marginBottom: 8 }}>
                                                    {saveError}
                                                </div>
                                            )}
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                style={{
                                                    padding: '8px 20px', borderRadius: 8, fontSize: 12,
                                                    background: saved
                                                        ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                                        : accent,
                                                    color: saved ? (isDark ? '#A6E3A1' : '#276749') : '#fff',
                                                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                                                    fontWeight: 500, transition: 'all 0.2s',
                                                    opacity: saving ? 0.7 : 1,
                                                }}
                                            >
                                                {saved ? '✓ Сохранено' : saving ? 'Сохранение...' : 'Сохранить оценку'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'solution' && (
                    <div>
                        <div style={{
                            background: isDark ? '#11111B' : '#1A202C',
                            borderRadius: 10, padding: '14px 16px',
                        }}>
                            <div style={{ fontSize: 10, color: '#A6ADC8', marginBottom: 8 }}>Python — Правильное решение</div>
                            <pre style={{
                                fontFamily: 'monospace', fontSize: 12,
                                color: '#CDD6F4', margin: 0,
                                overflowX: 'auto', lineHeight: 1.7,
                            }}>
                {task.solution}
              </pre>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function Tasks() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'
    const { authFetch } = useAuth()

    const [tasks, setTasks]               = useState([])
    const [selectedTask, setSelectedTask] = useState(null)
    const [search, setSearch]             = useState('')

    useEffect(() => {
        authFetch('/api/tasks')
            .then(r => r.json())
            .then(data => {
                setTasks(data)
                if (data.length > 0) setSelectedTask(data[0])
            })
            .catch(() => {})
    }, [])

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.topic || '').toLowerCase().includes(search.toLowerCase())
    )

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
                    <Link to="/" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>Главная</Link>
                    <span style={{ color: t.textSecondary, fontSize: 12 }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Задания</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ThemeToggle />
                    <button style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12,
                        background: accent, color: '#fff', border: 'none',
                        fontWeight: 500, cursor: 'pointer',
                    }}>
                        + Новое задание
                    </button>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* ── Левая панель: список заданий ── */}
                <div style={{
                    width: 300, minWidth: 300,
                    background: isDark ? '#13141F' : '#fff',
                    borderRight: `1px solid ${t.border}`,
                    display: 'flex', flexDirection: 'column',
                    overflowY: 'auto',
                }}>
                    {/* Поиск */}
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}` }}>
                        <input
                            type="text"
                            placeholder="Поиск заданий..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '8px 12px',
                                borderRadius: 8, fontSize: 12,
                                border: `1px solid ${t.border}`,
                                background: isDark ? '#1E1F2E' : '#F4F6FA',
                                color: t.text, outline: 'none',
                            }}
                        />
                    </div>

                    {/* Список */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredTasks.length === 0 ? (
                            <div style={{ padding: 20, textAlign: 'center', color: t.textSecondary, fontSize: 13 }}>
                                Заданий не найдено
                            </div>
                        ) : (
                            filteredTasks.map(task => {
                                const isActive = selectedTask?.id === task.id
                                return (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: `1px solid ${t.border}`,
                                            cursor: 'pointer',
                                            background: isActive
                                                ? (isDark ? '#1E3A5F' : '#EBF4FF')
                                                : 'transparent',
                                            borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                                            transition: 'all 0.12s',
                                        }}
                                    >
                                        <div style={{ marginBottom: 5 }}>
                                            <span style={{
                                                fontSize: 13, fontWeight: isActive ? 500 : 400,
                                                color: isActive ? accent : t.text,
                                                lineHeight: 1.4,
                                            }}>
                                                {task.title}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 11, color: t.textSecondary }}>{task.topic}</span>
                                            <span style={{ color: t.border }}>·</span>
                                            <LevelPill level={task.level} isDark={isDark} />
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* ── Правая панель: детали задания ── */}
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {selectedTask ? (
                        <TaskDetail
                            key={selectedTask.id}
                            task={selectedTask}
                            t={t}
                            isDark={isDark}
                            accent={accent}
                            authFetch={authFetch}
                        />
                    ) : (
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: t.textSecondary, fontSize: 14,
                        }}>
                            Выберите задание из списка
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}