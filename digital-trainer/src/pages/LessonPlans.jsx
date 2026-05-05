// src/pages/LessonPlans.jsx
// Планы уроков — Цифровой тренажёр для учителей информатики

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'

// ─── Данные ──────────────────────────────────────────────────────────────────

const initialPlans = [
    {
        id: 1,
        title: 'Введение в алгоритмы',
        topic: 'Алгоритмы',
        grade: '7 класс',
        duration: 45,
        date: '2026-04-28',
        status: 'ready',
        goal: 'Познакомить учеников с понятием алгоритма и его основными свойствами',
        steps: [
            { id: 1, type: 'intro',    title: 'Организационный момент',        duration: 5,  desc: 'Приветствие, проверка готовности к уроку' },
            { id: 2, type: 'theory',   title: 'Что такое алгоритм?',           duration: 10, desc: 'Объяснение понятия алгоритма через бытовые примеры: рецепт, инструкция' },
            { id: 3, type: 'practice', title: 'Свойства алгоритмов',           duration: 10, desc: 'Разбор 4 ключевых свойств: дискретность, детерминированность, конечность, результативность' },
            { id: 4, type: 'sandbox',  title: 'Практика в Colab',              duration: 12, desc: 'Написание первого алгоритма на Python — поиск максимума в списке' },
            { id: 5, type: 'task',     title: 'Самостоятельная работа',        duration: 5,  desc: 'Задание: написать алгоритм для нахождения суммы чисел' },
            { id: 6, type: 'outro',    title: 'Итог урока',                    duration: 3,  desc: 'Обсуждение результатов, домашнее задание' },
        ],
    },
    {
        id: 2,
        title: 'Типы данных в Python',
        topic: 'Типы данных',
        grade: '7 класс',
        duration: 45,
        date: '2026-05-02',
        status: 'ready',
        goal: 'Изучить основные типы данных Python и научиться их применять',
        steps: [
            { id: 1, type: 'intro',    title: 'Повторение пройденного',        duration: 5,  desc: 'Краткое повторение алгоритмов' },
            { id: 2, type: 'theory',   title: 'Целые и дробные числа',         duration: 8,  desc: 'int, float — примеры, операции, ограничения' },
            { id: 3, type: 'theory',   title: 'Строки и булевы значения',      duration: 8,  desc: 'str, bool — создание, операции, преобразование типов' },
            { id: 4, type: 'practice', title: 'Функция type()',                duration: 7,  desc: 'Демонстрация определения типа переменной через type()' },
            { id: 5, type: 'sandbox',  title: 'Практика в Colab',              duration: 12, desc: 'Эксперименты с разными типами данных, преобразования' },
            { id: 6, type: 'outro',    title: 'Итог и д/з',                   duration: 5,  desc: 'Домашнее задание: написать программу с 4 разными типами' },
        ],
    },
    {
        id: 3,
        title: 'Условия и циклы',
        topic: 'Условия и циклы',
        grade: '8 класс',
        duration: 45,
        date: '2026-05-05',
        status: 'draft',
        goal: 'Научить использовать условные операторы и циклы для управления программой',
        steps: [
            { id: 1, type: 'intro',    title: 'Мотивация темы',               duration: 3,  desc: 'Зачем нужны условия и циклы — реальные примеры' },
            { id: 2, type: 'theory',   title: 'Оператор if/elif/else',         duration: 12, desc: 'Синтаксис, блок-схема, примеры на доске' },
            { id: 3, type: 'sandbox',  title: 'Практика if/elif/else',         duration: 10, desc: 'Программа определения оценки по баллам' },
            { id: 4, type: 'theory',   title: 'Циклы for и while',             duration: 10, desc: 'Разница между for и while, когда что использовать' },
            { id: 5, type: 'task',     title: 'Самостоятельная работа',        duration: 7,  desc: 'Написать программу с использованием цикла и условия' },
            { id: 6, type: 'outro',    title: 'Итог урока',                    duration: 3,  desc: 'Подведение итогов, д/з' },
        ],
    },
    {
        id: 4,
        title: 'Функции — основы',
        topic: 'Функции',
        grade: '8 класс',
        duration: 45,
        date: '2026-05-12',
        status: 'draft',
        goal: 'Познакомить с концепцией функций, научить создавать и вызывать функции',
        steps: [
            { id: 1, type: 'intro',    title: 'Зачем нужны функции?',          duration: 5,  desc: 'Принцип DRY — не повторяй себя' },
            { id: 2, type: 'theory',   title: 'Определение функции',           duration: 10, desc: 'def, параметры, return — синтаксис и примеры' },
            { id: 3, type: 'practice', title: 'Разбор примеров',               duration: 10, desc: 'Функции с параметрами по умолчанию, несколько возвращаемых значений' },
            { id: 4, type: 'sandbox',  title: 'Практика в Colab',              duration: 15, desc: 'Написание калькулятора с функциями' },
            { id: 5, type: 'outro',    title: 'Итог и д/з',                   duration: 5,  desc: 'Домашнее задание: создать функцию для решения задачи' },
        ],
    },
    {
        id: 5,
        title: 'Списки и массивы',
        topic: 'Массивы',
        grade: '9 класс',
        duration: 45,
        date: '2026-05-19',
        status: 'draft',
        goal: 'Изучить работу со списками: создание, индексация, методы',
        steps: [
            { id: 1, type: 'intro',    title: 'Введение в коллекции',          duration: 5,  desc: 'Зачем хранить много значений в одной переменной' },
            { id: 2, type: 'theory',   title: 'Создание и индексация',         duration: 10, desc: 'Аналогия с шкафчиками, нумерация с нуля' },
            { id: 3, type: 'practice', title: 'Методы списков',                duration: 10, desc: 'append, remove, sort, len — демонстрация' },
            { id: 4, type: 'sandbox',  title: 'Практика в Colab',              duration: 15, desc: 'Работа со списком студентов и их оценками' },
            { id: 5, type: 'outro',    title: 'Итог и д/з',                   duration: 5,  desc: 'Домашнее задание: программа для работы со списком' },
        ],
    },
    {
        id: 6,
        title: 'ООП — Классы и объекты',
        topic: 'ООП',
        grade: '9 класс',
        duration: 45,
        date: '2026-05-26',
        status: 'draft',
        goal: 'Познакомить с основами ООП: классы, объекты, атрибуты, методы',
        steps: [
            { id: 1, type: 'intro',    title: 'Что такое ООП?',               duration: 5,  desc: 'Аналогия: форма для печенья (класс) и печенье (объект)' },
            { id: 2, type: 'theory',   title: 'Класс и __init__',              duration: 12, desc: 'Синтаксис класса, конструктор, self' },
            { id: 3, type: 'practice', title: 'Методы класса',                 duration: 10, desc: 'Написание методов, вызов методов у объекта' },
            { id: 4, type: 'sandbox',  title: 'Практика в Colab',              duration: 13, desc: 'Создание класса Студент с атрибутами и методами' },
            { id: 5, type: 'outro',    title: 'Итог урока',                    duration: 5,  desc: 'Обсуждение, д/з: создать свой класс' },
        ],
    },
]

// ─── Конфиг типов шагов ────────────────────────────────────────────────────────

const STEP_TYPES = {
    intro:    { label: 'Введение',    emoji: '🎯', bgLight: '#EBF4FF', colorLight: '#1A6EFF', bgDark: '#1E3A5F', colorDark: '#89B4FA' },
    theory:   { label: 'Теория',     emoji: '📖', bgLight: '#F5F0FF', colorLight: '#6B4FC8', bgDark: '#2A1F4A', colorDark: '#CBA6F7' },
    practice: { label: 'Разбор',     emoji: '🔍', bgLight: '#FFFBEB', colorLight: '#975A16', bgDark: '#3A2E10', colorDark: '#F9E2AF' },
    sandbox:  { label: 'Colab',      emoji: '💻', bgLight: '#E6FFEE', colorLight: '#276749', bgDark: '#1A3A2A', colorDark: '#A6E3A1' },
    task:     { label: 'Задание',    emoji: '✏️', bgLight: '#FFF5F5', colorLight: '#C53030', bgDark: '#2E1A3A', colorDark: '#F28B82' },
    outro:    { label: 'Итог',       emoji: '✅', bgLight: '#F0FFF4', colorLight: '#276749', bgDark: '#1A3A2A', colorDark: '#A6E3A1' },
}

const STATUS_CONFIG = {
    ready: { label: 'Готов',    bgLight: '#E6FFEE', colorLight: '#276749', bgDark: '#1A3A2A', colorDark: '#A6E3A1' },
    draft: { label: 'Черновик', bgLight: '#FFFBEB', colorLight: '#975A16', bgDark: '#3A2E10', colorDark: '#F9E2AF' },
}

// ─── Вспомогательные компоненты ───────────────────────────────────────────────

function StatusBadge({ status, isDark }) {
    const s = STATUS_CONFIG[status]
    return (
        <span style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 5, fontWeight: 500,
            background: isDark ? s.bgDark : s.bgLight,
            color: isDark ? s.colorDark : s.colorLight,
        }}>
      {s.label}
    </span>
    )
}

function StepTypeBadge({ type, isDark }) {
    const s = STEP_TYPES[type]
    return (
        <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 5, fontWeight: 500,
            background: isDark ? s.bgDark : s.bgLight,
            color: isDark ? s.colorDark : s.colorLight,
            flexShrink: 0,
        }}>
      {s.emoji} {s.label}
    </span>
    )
}

// ─── Панель деталей плана ────────────────────────────────────────────────────

function PlanDetail({ plan, t, isDark, accent }) {
    const totalMinutes = plan.steps.reduce((sum, s) => sum + s.duration, 0)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

            {/* Заголовок */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <StatusBadge status={plan.status} isDark={isDark} />
                    <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 5,
                        background: isDark ? '#181926' : '#F4F6FA',
                        color: t.textSecondary, border: `1px solid ${t.border}`,
                    }}>
            {plan.grade}
          </span>
                    <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 5,
                        background: isDark ? '#181926' : '#F4F6FA',
                        color: t.textSecondary, border: `1px solid ${t.border}`,
                    }}>
            {plan.topic}
          </span>
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 8 }}>
                    {plan.title}
                </h2>

                <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: t.textSecondary }}>📅 {plan.date}</span>
                    <span style={{ fontSize: 12, color: t.textSecondary }}>⏱ {plan.duration} мин</span>
                    <span style={{ fontSize: 12, color: t.textSecondary }}>📝 {plan.steps.length} этапов</span>
                </div>

                {/* Цель урока */}
                <div style={{
                    background: isDark ? '#1E3A5F' : '#EBF4FF',
                    border: `1px solid ${isDark ? '#2A4A7A' : '#BED7FF'}`,
                    borderRadius: 8, padding: '10px 14px',
                }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: accent, marginBottom: 4 }}>
                        🎯 Цель урока
                    </div>
                    <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>
                        {plan.goal}
                    </div>
                </div>
            </div>

            {/* Тайм-бар */}
            <div style={{ padding: '14px 24px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: t.text }}>Распределение времени</span>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>{totalMinutes} / {plan.duration} мин</span>
                </div>
                <div style={{ display: 'flex', height: 8, borderRadius: 10, overflow: 'hidden', gap: 1 }}>
                    {plan.steps.map((step, i) => {
                        const pct = (step.duration / plan.duration) * 100
                        const s = STEP_TYPES[step.type]
                        return (
                            <div
                                key={i}
                                title={`${step.title}: ${step.duration} мин`}
                                style={{
                                    width: `${pct}%`,
                                    background: isDark ? s.colorDark : s.colorLight,
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    transition: 'opacity 0.12s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
                            />
                        )
                    })}
                </div>
                {/* Легенда */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                    {Object.entries(STEP_TYPES).map(([key, val]) => {
                        const hasStep = plan.steps.some(s => s.type === key)
                        if (!hasStep) return null
                        return (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{
                                    width: 8, height: 8, borderRadius: 2,
                                    background: isDark ? val.colorDark : val.colorLight,
                                }} />
                                <span style={{ fontSize: 10, color: t.textSecondary }}>{val.emoji} {val.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Шаги */}
            <div style={{ padding: '16px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>
                    Этапы урока
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.steps.map((step, index) => (
                        <div
                            key={step.id}
                            style={{
                                display: 'flex', alignItems: 'flex-start', gap: 12,
                                padding: '12px 14px',
                                background: isDark ? '#181926' : '#fff',
                                border: `1px solid ${t.border}`,
                                borderRadius: 10,
                            }}
                        >
                            {/* Номер */}
                            <div style={{
                                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                                background: isDark ? '#1E3A5F' : '#EBF4FF',
                                color: accent,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 600,
                            }}>
                                {index + 1}
                            </div>

                            {/* Контент */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>
                    {step.title}
                  </span>
                                    <StepTypeBadge type={step.type} isDark={isDark} />
                                </div>
                                <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>
                                    {step.desc}
                                </div>
                            </div>

                            {/* Время */}
                            <div style={{
                                flexShrink: 0,
                                fontSize: 12, fontWeight: 500,
                                color: accent,
                                background: isDark ? '#1E3A5F' : '#EBF4FF',
                                padding: '3px 10px', borderRadius: 6,
                            }}>
                                {step.duration} мин
                            </div>
                        </div>
                    ))}
                </div>

                {/* Кнопки действий */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button style={{
                        flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 12,
                        background: accent, color: '#fff', border: 'none',
                        fontWeight: 500, cursor: 'pointer',
                    }}>
                        ▶ Начать урок
                    </button>
                    <button style={{
                        padding: '9px 16px', borderRadius: 8, fontSize: 12,
                        background: 'transparent',
                        border: `1px solid ${t.border}`,
                        color: t.textSecondary, cursor: 'pointer',
                    }}>
                        ✏️ Редактировать
                    </button>
                    <button style={{
                        padding: '9px 16px', borderRadius: 8, fontSize: 12,
                        background: 'transparent',
                        border: `1px solid ${t.border}`,
                        color: t.textSecondary, cursor: 'pointer',
                    }}>
                        📋 Дублировать
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Модальное окно нового плана ─────────────────────────────────────────────

function NewPlanModal({ t, isDark, accent, onClose, onSave }) {
    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('')
    const [grade, setGrade] = useState('7 класс')
    const [date, setDate] = useState('')
    const [goal, setGoal] = useState('')

    const inputStyle = {
        width: '100%', padding: '8px 12px',
        borderRadius: 8, fontSize: 13,
        border: `1px solid ${t.border}`,
        background: isDark ? '#1E1F2E' : '#F4F6FA',
        color: t.text, outline: 'none',
        fontFamily: 'inherit',
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                width: 480,
                background: isDark ? '#181926' : '#fff',
                borderRadius: 14,
                padding: 24,
                border: `1px solid ${t.border}`,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Новый план урока</h3>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', fontSize: 18,
                        color: t.textSecondary, cursor: 'pointer',
                    }}>×</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Название урока *</div>
                        <input value={title} onChange={e => setTitle(e.target.value)}
                               placeholder="Например: Введение в алгоритмы" style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Тема</div>
                            <input value={topic} onChange={e => setTopic(e.target.value)}
                                   placeholder="Алгоритмы" style={inputStyle} />
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Класс</div>
                            <select value={grade} onChange={e => setGrade(e.target.value)} style={inputStyle}>
                                {['7 класс','8 класс','9 класс','10 класс','11 класс'].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Дата урока</div>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Цель урока</div>
                        <textarea value={goal} onChange={e => setGoal(e.target.value)}
                                  placeholder="Чему должны научиться ученики..." rows={3}
                                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button
                        onClick={() => {
                            if (title) onSave({ title, topic, grade, date, goal })
                        }}
                        style={{
                            flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13,
                            background: accent, color: '#fff', border: 'none',
                            fontWeight: 500, cursor: 'pointer',
                        }}
                    >
                        Создать план
                    </button>
                    <button onClick={onClose} style={{
                        padding: '9px 20px', borderRadius: 8, fontSize: 13,
                        background: 'transparent', border: `1px solid ${t.border}`,
                        color: t.textSecondary, cursor: 'pointer',
                    }}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function LessonPlans() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const [plans, setPlans] = useState(initialPlans)
    const [selectedPlan, setSelectedPlan] = useState(initialPlans[0])
    const [showModal, setShowModal] = useState(false)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filtered = plans.filter(p => {
        const matchFilter = filter === 'all' || p.status === filter
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.topic.toLowerCase().includes(search.toLowerCase())
        return matchFilter && matchSearch
    })

    function handleSave({ title, topic, grade, date, goal }) {
        const newPlan = {
            id: plans.length + 1,
            title, topic, grade, date: date || '—',
            duration: 45, status: 'draft', goal,
            steps: [
                { id: 1, type: 'intro',  title: 'Введение',         duration: 5,  desc: 'Организационный момент' },
                { id: 2, type: 'theory', title: 'Основная часть',   duration: 30, desc: 'Изложение материала' },
                { id: 3, type: 'outro',  title: 'Итог',             duration: 10, desc: 'Подведение итогов урока' },
            ],
        }
        setPlans(prev => [newPlan, ...prev])
        setSelectedPlan(newPlan)
        setShowModal(false)
    }

    const filterBtn = (key, label, count) => (
        <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 11,
                border: `1px solid ${filter === key ? accent : t.border}`,
                background: filter === key ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                color: filter === key ? accent : t.textSecondary,
                cursor: 'pointer', fontWeight: filter === key ? 500 : 400,
                transition: 'all 0.12s',
            }}
        >
            {label}
            {count > 0 && (
                <span style={{
                    marginLeft: 4, fontSize: 10,
                    background: filter === key ? accent : t.border,
                    color: filter === key ? '#fff' : t.textSecondary,
                    padding: '1px 5px', borderRadius: 8,
                }}>{count}</span>
            )}
        </button>
    )

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {showModal && (
                <NewPlanModal
                    t={t} isDark={isDark} accent={accent}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}

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
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Планы уроков</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ThemeToggle />
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 12,
                            background: accent, color: '#fff', border: 'none',
                            fontWeight: 500, cursor: 'pointer',
                        }}
                    >
                        + Новый план
                    </button>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Левая панель */}
                <div style={{
                    width: 290, minWidth: 290,
                    background: isDark ? '#13141F' : '#fff',
                    borderRight: `1px solid ${t.border}`,
                    display: 'flex', flexDirection: 'column',
                }}>
                    {/* Поиск */}
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}` }}>
                        <input
                            placeholder="Поиск планов..."
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

                    {/* Фильтры */}
                    <div style={{
                        padding: '10px 14px', display: 'flex', gap: 6,
                        borderBottom: `1px solid ${t.border}`,
                    }}>
                        {filterBtn('all',   'Все',       plans.length)}
                        {filterBtn('ready', 'Готовые',   plans.filter(p => p.status === 'ready').length)}
                        {filterBtn('draft', 'Черновики', plans.filter(p => p.status === 'draft').length)}
                    </div>

                    {/* Список */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filtered.map(plan => {
                            const isActive = selectedPlan?.id === plan.id
                            return (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    style={{
                                        padding: '13px 16px',
                                        borderBottom: `1px solid ${t.border}`,
                                        cursor: 'pointer',
                                        background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                        borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                                        transition: 'all 0.12s',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                    <span style={{
                        fontSize: 13, fontWeight: isActive ? 500 : 400,
                        color: isActive ? accent : t.text,
                        flex: 1, marginRight: 8, lineHeight: 1.4,
                    }}>
                      {plan.title}
                    </span>
                                        <StatusBadge status={plan.status} isDark={isDark} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>{plan.grade}</span>
                                        <span style={{ color: t.border }}>·</span>
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>⏱ {plan.duration} мин</span>
                                        <span style={{ color: t.border }}>·</span>
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>📅 {plan.date}</span>
                                    </div>
                                    {/* Мини тайм-бар */}
                                    <div style={{ display: 'flex', height: 4, borderRadius: 4, overflow: 'hidden', marginTop: 8, gap: 1 }}>
                                        {plan.steps.map((step, i) => {
                                            const pct = (step.duration / plan.duration) * 100
                                            const s = STEP_TYPES[step.type]
                                            return (
                                                <div key={i} style={{
                                                    width: `${pct}%`,
                                                    background: isDark ? s.colorDark : s.colorLight,
                                                    opacity: 0.7,
                                                }} />
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Правая панель */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {selectedPlan ? (
                        <PlanDetail plan={selectedPlan} t={t} isDark={isDark} accent={accent} />
                    ) : (
                        <div style={{
                            height: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: t.textSecondary, fontSize: 14,
                        }}>
                            Выберите план урока
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}