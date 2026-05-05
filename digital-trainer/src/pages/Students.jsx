// src/pages/Students.jsx
// Мои ученики — Цифровой тренажёр для учителей информатики

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

// ─── Данные ──────────────────────────────────────────────────────────────────

const initialStudents = [
    {
        id: 1,
        name: 'Алия Муратова',
        initials: 'АМ',
        group: '7А',
        email: 'aliya.muratova@school.kz',
        phone: '+7 701 234 5678',
        score: 88,
        tasksTotal: 12,
        tasksDone: 11,
        lastActive: '26 апр 2026',
        status: 'active',
        topicsDone: 8,
        topicsTotal: 12,
        colabSessions: 9,
        grades: [85, 90, 88, 92, 87, 88],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 95 },
            { name: 'Типы данных',      done: true,  score: 80 },
            { name: 'Условия и циклы',  done: true,  score: 90 },
            { name: 'Функции',          done: true,  score: 88 },
            { name: 'Списки',           done: true,  score: 85 },
            { name: 'ООП',              done: false, score: null },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
    {
        id: 2,
        name: 'Данияр Касымов',
        initials: 'ДК',
        group: '7А',
        email: 'daniyar.kasymov@school.kz',
        phone: '+7 702 345 6789',
        score: 74,
        tasksTotal: 12,
        tasksDone: 9,
        lastActive: '25 апр 2026',
        status: 'active',
        topicsDone: 6,
        topicsTotal: 12,
        colabSessions: 7,
        grades: [70, 75, 74, 78, 72, 74],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 80 },
            { name: 'Типы данных',      done: true,  score: 74 },
            { name: 'Условия и циклы',  done: true,  score: 70 },
            { name: 'Функции',          done: true,  score: 75 },
            { name: 'Списки',           done: false, score: null },
            { name: 'ООП',              done: false, score: null },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
    {
        id: 3,
        name: 'Зарина Нурланова',
        initials: 'ЗН',
        group: '7Б',
        email: 'zarina.nurlanova@school.kz',
        phone: '+7 705 456 7890',
        score: 61,
        tasksTotal: 12,
        tasksDone: 7,
        lastActive: '24 апр 2026',
        status: 'active',
        topicsDone: 5,
        topicsTotal: 12,
        colabSessions: 5,
        grades: [55, 60, 65, 62, 60, 61],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 65 },
            { name: 'Типы данных',      done: true,  score: 60 },
            { name: 'Условия и циклы',  done: true,  score: 55 },
            { name: 'Функции',          done: false, score: null },
            { name: 'Списки',           done: false, score: null },
            { name: 'ООП',              done: false, score: null },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
    {
        id: 4,
        name: 'Бекзат Сейткали',
        initials: 'БС',
        group: '7Б',
        email: 'bekzat.seitkali@school.kz',
        phone: '+7 707 567 8901',
        score: 43,
        tasksTotal: 12,
        tasksDone: 4,
        lastActive: '20 апр 2026',
        status: 'risk',
        topicsDone: 3,
        topicsTotal: 12,
        colabSessions: 3,
        grades: [40, 45, 42, 48, 40, 43],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 48 },
            { name: 'Типы данных',      done: true,  score: 42 },
            { name: 'Условия и циклы',  done: false, score: null },
            { name: 'Функции',          done: false, score: null },
            { name: 'Списки',           done: false, score: null },
            { name: 'ООП',              done: false, score: null },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
    {
        id: 5,
        name: 'Айгерим Токова',
        initials: 'АТ',
        group: '7А',
        email: 'aigerim.tokova@school.kz',
        phone: '+7 708 678 9012',
        score: 95,
        tasksTotal: 12,
        tasksDone: 12,
        lastActive: '26 апр 2026',
        status: 'active',
        topicsDone: 10,
        topicsTotal: 12,
        colabSessions: 11,
        grades: [92, 95, 94, 98, 95, 95],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 98 },
            { name: 'Типы данных',      done: true,  score: 95 },
            { name: 'Условия и циклы',  done: true,  score: 92 },
            { name: 'Функции',          done: true,  score: 96 },
            { name: 'Списки',           done: true,  score: 94 },
            { name: 'ООП',              done: true,  score: 95 },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
    {
        id: 6,
        name: 'Нурлан Абенов',
        initials: 'НА',
        group: '7Б',
        email: 'nurlan.abenov@school.kz',
        phone: '+7 771 789 0123',
        score: 55,
        tasksTotal: 12,
        tasksDone: 6,
        lastActive: '22 апр 2026',
        status: 'active',
        topicsDone: 4,
        topicsTotal: 12,
        colabSessions: 4,
        grades: [50, 55, 58, 54, 52, 55],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 58 },
            { name: 'Типы данных',      done: true,  score: 55 },
            { name: 'Условия и циклы',  done: true,  score: 50 },
            { name: 'Функции',          done: false, score: null },
            { name: 'Списки',           done: false, score: null },
            { name: 'ООП',              done: false, score: null },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
    {
        id: 7,
        name: 'Камила Ержанова',
        initials: 'КЕ',
        group: '7А',
        email: 'kamila.erzhanova@school.kz',
        phone: '+7 775 890 1234',
        score: 82,
        tasksTotal: 12,
        tasksDone: 10,
        lastActive: '25 апр 2026',
        status: 'active',
        topicsDone: 7,
        topicsTotal: 12,
        colabSessions: 8,
        grades: [78, 82, 84, 80, 82, 82],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 84 },
            { name: 'Типы данных',      done: true,  score: 80 },
            { name: 'Условия и циклы',  done: true,  score: 82 },
            { name: 'Функции',          done: true,  score: 85 },
            { name: 'Списки',           done: true,  score: 78 },
            { name: 'ООП',              done: false, score: null },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
    {
        id: 8,
        name: 'Арман Дюсенов',
        initials: 'АД',
        group: '7Б',
        email: 'arman.dyusenov@school.kz',
        phone: '+7 776 901 2345',
        score: 38,
        tasksTotal: 12,
        tasksDone: 3,
        lastActive: '15 апр 2026',
        status: 'risk',
        topicsDone: 2,
        topicsTotal: 12,
        colabSessions: 2,
        grades: [35, 40, 38, 36, 38, 38],
        topics: [
            { name: 'Алгоритмы',       done: true,  score: 40 },
            { name: 'Типы данных',      done: false, score: null },
            { name: 'Условия и циклы',  done: false, score: null },
            { name: 'Функции',          done: false, score: null },
            { name: 'Списки',           done: false, score: null },
            { name: 'ООП',              done: false, score: null },
            { name: 'Рекурсия',         done: false, score: null },
            { name: 'Сортировки',       done: false, score: null },
        ],
    },
]

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function getScoreColor(score, isDark) {
    if (score >= 80) return isDark ? '#A6E3A1' : '#276749'
    if (score >= 60) return isDark ? '#F9E2AF' : '#975A16'
    return isDark ? '#F28B82' : '#C53030'
}

function getScoreBg(score, isDark) {
    if (score >= 80) return isDark ? '#1A3A2A' : '#E6FFEE'
    if (score >= 60) return isDark ? '#3A2E10' : '#FFFBEB'
    return isDark ? '#2E1A1A' : '#FFF5F5'
}

// ─── Модальное окно добавления ученика ───────────────────────────────────────

// Formats digits to +7 (XXX) XXX-XXXX as the user types
function formatKzPhone(raw) {
    const digits = raw.replace(/\D/g, '').replace(/^8/, '7').replace(/^7?/, '7').slice(0, 11)
    if (digits.length <= 1) return digits.length ? '+7' : ''
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
}

function validateFields(name, email, phone, password) {
    const errs = {}
    const words = name.trim().split(/\s+/)
    if (words.length < 2 || words.some(w => w.length < 2 || !/^[a-zA-ZА-ЯёЁа-яІіҢңҒғҚқҮүҰұӘәӨөҺһ]+$/u.test(w)))
        errs.name = 'Введите имя и фамилию (только буквы, каждое слово от 2 символов)'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errs.email = 'Введите корректный email'
    if (phone) {
        const digits = phone.replace(/\D/g, '')
        if (digits.length !== 11)
            errs.phone = 'Номер должен содержать 11 цифр'
    }
    if (password.length < 6)
        errs.password = 'Пароль минимум 6 символов'
    return errs
}

function AddStudentModal({ t, isDark, accent, onClose, onAdd }) {
    const [name, setName]         = useState('')
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [group, setGroup]       = useState('7А')
    const [phone, setPhone]       = useState('')
    const [errs, setErrs]         = useState({})
    const [serverError, setServerError] = useState('')
    const [saving, setSaving]     = useState(false)

    function inputStyle(hasErr) {
        return {
            width: '100%', padding: '8px 12px',
            borderRadius: 8, fontSize: 13,
            border: `1.5px solid ${hasErr ? (isDark ? '#F28B82' : '#E53E3E') : t.border}`,
            background: isDark ? '#1E1F2E' : '#F4F6FA',
            color: t.text, outline: 'none', fontFamily: 'inherit',
        }
    }

    function fieldErr(key) {
        return errs[key] ? (
            <div style={{ fontSize: 11, color: isDark ? '#F28B82' : '#C53030', marginTop: 4 }}>
                {errs[key]}
            </div>
        ) : null
    }

    async function handleSubmit() {
        const errors = validateFields(name, email, phone, password)
        if (Object.keys(errors).length) { setErrs(errors); return }
        setSaving(true); setErrs({}); setServerError('')
        const err = await onAdd({ name: name.trim(), email, password, classGroup: group, phone: phone || undefined })
        setSaving(false)
        if (err) setServerError(err)
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                width: 440,
                background: isDark ? '#181926' : '#fff',
                borderRadius: 14, padding: 24,
                border: `1px solid ${t.border}`,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Добавить ученика</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: t.textSecondary, cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Полное имя (Имя Фамилия) *</div>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Алия Муратова" style={inputStyle(errs.name)} />
                        {fieldErr('name')}
                    </div>

                    <div>
                        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Email *</div>
                        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@school.kz" style={inputStyle(errs.email)} />
                        {fieldErr('email')}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Телефон</div>
                            <input
                                value={phone}
                                onChange={e => setPhone(formatKzPhone(e.target.value))}
                                placeholder="+7 (700) 000-00-00"
                                style={inputStyle(errs.phone)}
                            />
                            {fieldErr('phone')}
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Класс</div>
                            <select value={group} onChange={e => setGroup(e.target.value)} style={inputStyle(false)}>
                                {['7А','7Б','8А','8Б','9А','9Б'].map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>Начальный пароль *</div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 6 символов" style={inputStyle(errs.password)} />
                        {fieldErr('password')}
                    </div>

                    {serverError && (
                        <div style={{ fontSize: 12, color: isDark ? '#F28B82' : '#C53030', padding: '6px 10px', borderRadius: 6, background: isDark ? '#2E1A1A' : '#FFF5F5' }}>
                            {serverError}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button
                        disabled={saving}
                        onClick={handleSubmit}
                        style={{
                            flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13,
                            background: accent, color: '#fff', border: 'none',
                            fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1,
                        }}
                    >
                        {saving ? 'Сохранение...' : 'Добавить'}
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

// ─── Детали ученика ───────────────────────────────────────────────────────────

function StudentDetail({ student, t, isDark, accent }) {
    const [activeTab, setActiveTab] = useState('overview')

    const tabStyle = (tab) => ({
        padding: '8px 16px', fontSize: 12, cursor: 'pointer',
        border: 'none', background: 'transparent',
        color: activeTab === tab ? accent : t.textSecondary,
        borderBottom: activeTab === tab ? `2px solid ${accent}` : '2px solid transparent',
        fontWeight: activeTab === tab ? 500 : 400,
        transition: 'all 0.12s',
    })

    const avgScore = student.grades.reduce((a, b) => a + b, 0) / student.grades.length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Профиль */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: getScoreBg(student.score, isDark),
                        color: getScoreColor(student.score, isDark),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, flexShrink: 0,
                    }}>
                        {student.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <h2 style={{ fontSize: 17, fontWeight: 600, color: t.text }}>{student.name}</h2>
                            {student.status === 'risk' && (
                                <span style={{
                                    fontSize: 10, padding: '2px 7px', borderRadius: 5,
                                    background: isDark ? '#2E1A1A' : '#FFF5F5',
                                    color: isDark ? '#F28B82' : '#C53030',
                                    fontWeight: 500,
                                }}>⚠️ Нужна помощь</span>
                            )}
                        </div>
                        <div style={{ fontSize: 12, color: t.textSecondary }}>
                            Класс {student.group} · {student.email}
                        </div>
                    </div>
                    <div style={{
                        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                        background: getScoreBg(student.score, isDark),
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: getScoreColor(student.score, isDark) }}>
                            {student.score}
                        </div>
                        <div style={{ fontSize: 9, color: getScoreColor(student.score, isDark) }}>баллов</div>
                    </div>
                </div>

                {/* Мини-статистика */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {[
                        { label: 'Задач сдано',    value: `${student.tasksDone}/${student.tasksTotal}` },
                        { label: 'Тем изучено',    value: `${student.topicsDone}/${student.topicsTotal}` },
                        { label: 'Сессий Colab',   value: student.colabSessions },
                        { label: 'Последний вход', value: student.lastActive },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: isDark ? '#181926' : '#F4F6FA',
                            border: `1px solid ${t.border}`,
                            borderRadius: 8, padding: '9px 12px',
                        }}>
                            <div style={{ fontSize: 10, color: t.textSecondary, marginBottom: 3 }}>{item.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Табы */}
            <div style={{
                display: 'flex', borderBottom: `1px solid ${t.border}`,
                background: isDark ? '#13141F' : '#fff', paddingLeft: 8,
            }}>
                <button style={tabStyle('overview')}  onClick={() => setActiveTab('overview')}>Прогресс</button>
                <button style={tabStyle('topics')}    onClick={() => setActiveTab('topics')}>По темам</button>
                <button style={tabStyle('contacts')}  onClick={() => setActiveTab('contacts')}>Контакты</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px' }}>

                {/* Прогресс */}
                {activeTab === 'overview' && (
                    <div>
                        {/* График оценок */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>
                                Динамика оценок
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                                {student.grades.map((g, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                        <div style={{
                                            width: '100%',
                                            height: `${(g / 100) * 70}px`,
                                            borderRadius: '4px 4px 0 0',
                                            background: getScoreColor(g, isDark),
                                            opacity: 0.8,
                                        }} />
                                        <div style={{ fontSize: 10, color: t.textSecondary }}>З{i + 1}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: 11, color: t.textSecondary, marginTop: 6, textAlign: 'right' }}>
                                Средняя: <strong style={{ color: getScoreColor(avgScore, isDark) }}>{avgScore.toFixed(0)}</strong>
                            </div>
                        </div>

                        {/* Прогресс-бары */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Задачи',          value: student.tasksDone,   total: student.tasksTotal },
                                { label: 'Темы',            value: student.topicsDone,  total: student.topicsTotal },
                                { label: 'Сессии Colab',    value: student.colabSessions, total: 12 },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <span style={{ fontSize: 12, color: t.text }}>{item.label}</span>
                                        <span style={{ fontSize: 12, color: accent }}>{item.value}/{item.total}</span>
                                    </div>
                                    <div style={{ height: 7, borderRadius: 10, background: t.border }}>
                                        <div style={{
                                            height: 7, borderRadius: 10,
                                            background: accent,
                                            width: `${(item.value / item.total) * 100}%`,
                                            transition: 'width 0.4s',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Алерт если ученик в зоне риска */}
                        {student.status === 'risk' && (
                            <div style={{
                                marginTop: 16,
                                background: isDark ? '#2E1A1A' : '#FFF5F5',
                                border: `1px solid ${isDark ? '#5A2A2A' : '#FED7D7'}`,
                                borderRadius: 10, padding: 14,
                            }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#F28B82' : '#C53030', marginBottom: 6 }}>
                                    ⚠️ Ученик нуждается в дополнительной помощи
                                </div>
                                <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>
                                    Средний балл ниже 60. Рекомендуется провести индивидуальную консультацию и проверить выполнение базовых заданий.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* По темам */}
                {activeTab === 'topics' && (
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>
                            Прогресс по темам
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {student.topics.map((topic, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 14px',
                                    background: isDark ? '#181926' : '#fff',
                                    border: `1px solid ${t.border}`,
                                    borderRadius: 9,
                                }}>
                                    <div style={{
                                        width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                                        background: topic.done
                                            ? getScoreBg(topic.score, isDark)
                                            : t.border,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 600,
                                        color: topic.done ? getScoreColor(topic.score, isDark) : t.textSecondary,
                                    }}>
                                        {topic.done ? '✓' : i + 1}
                                    </div>
                                    <span style={{
                                        flex: 1, fontSize: 13,
                                        color: topic.done ? t.text : t.textSecondary,
                                        fontWeight: topic.done ? 400 : 400,
                                    }}>
                    {topic.name}
                  </span>
                                    {topic.done ? (
                                        <span style={{
                                            fontSize: 12, fontWeight: 600,
                                            color: getScoreColor(topic.score, isDark),
                                            background: getScoreBg(topic.score, isDark),
                                            padding: '3px 10px', borderRadius: 6,
                                        }}>
                      {topic.score}
                    </span>
                                    ) : (
                                        <span style={{
                                            fontSize: 11, color: t.textSecondary,
                                            background: isDark ? '#181926' : '#F4F6FA',
                                            border: `1px solid ${t.border}`,
                                            padding: '3px 10px', borderRadius: 6,
                                        }}>
                      Не пройдено
                    </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Контакты */}
                {activeTab === 'contacts' && (
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>
                            Контактная информация
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Email',   value: student.email, icon: '✉️' },
                                { label: 'Телефон', value: student.phone, icon: '📱' },
                                { label: 'Класс',   value: student.group, icon: '🏫' },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 16px',
                                    background: isDark ? '#181926' : '#fff',
                                    border: `1px solid ${t.border}`,
                                    borderRadius: 10,
                                }}>
                                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 2 }}>{item.label}</div>
                                        <div style={{ fontSize: 13, color: t.text }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                            <button style={{
                                flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 12,
                                background: accent, color: '#fff', border: 'none',
                                fontWeight: 500, cursor: 'pointer',
                            }}>
                                ✉️ Написать сообщение
                            </button>
                            <button style={{
                                padding: '9px 16px', borderRadius: 8, fontSize: 12,
                                background: 'transparent', border: `1px solid ${t.border}`,
                                color: t.textSecondary, cursor: 'pointer',
                            }}>
                                ✏️ Редактировать
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Maps the flat UserResponse from the API to the richer view shape the page expects.
// Progress fields (score, tasks, topics) stay at 0 until the progress API is built.
function apiStudentToView(u) {
    const initials = u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return {
        id: u.id, name: u.name, initials,
        group: u.group || '—', email: u.email, phone: '',
        score: 0, tasksTotal: 0, tasksDone: 0,
        lastActive: '—', status: 'active',
        topicsDone: 0, topicsTotal: 0, colabSessions: 0,
        grades: [], topics: [],
    }
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function Students() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'
    const { authFetch } = useAuth()

    const [students, setStudents]     = useState(initialStudents)
    const [selected, setSelected]     = useState(initialStudents[0])
    const [showModal, setShowModal]   = useState(false)
    const [search, setSearch]         = useState('')
    const [filter, setFilter]         = useState('all')
    const [sortBy, setSortBy]         = useState('name')

    useEffect(() => {
        authFetch('/api/users?role=STUDENT')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                if (data.length > 0) {
                    const mapped = data.map(apiStudentToView)
                    setStudents(mapped)
                    setSelected(mapped[0])
                }
            })
            .catch(() => {})
    }, [])

    const filtered = students
        .filter(s => {
            const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
            const matchFilter =
                filter === 'all'  ? true :
                    filter === 'risk' ? s.status === 'risk' :
                        s.group === filter
            return matchSearch && matchFilter
        })
        .sort((a, b) => {
            if (sortBy === 'score') return b.score - a.score
            if (sortBy === 'tasks') return b.tasksDone - a.tasksDone
            return a.name.localeCompare(b.name)
        })

    async function handleAdd(fields) {
        try {
            const res = await authFetch('/api/users/students', {
                method: 'POST',
                body: JSON.stringify(fields),
            })
            if (res.status === 409) return 'Пользователь с таким email уже существует'
            if (!res.ok) return 'Ошибка сервера, попробуйте снова'
            const created = apiStudentToView(await res.json())
            setStudents(prev => [...prev, created])
            setSelected(created)
            setShowModal(false)
        } catch {
            return 'Ошибка соединения с сервером'
        }
    }

    const groups = ['all', ...new Set(students.map(s => s.group)), 'risk']
    const riskCount = students.filter(s => s.status === 'risk').length

    const filterBtn = (key, label) => (
        <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
                padding: '5px 11px', borderRadius: 7, fontSize: 11,
                border: `1px solid ${filter === key ? accent : t.border}`,
                background: filter === key ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                color: filter === key ? accent : t.textSecondary,
                cursor: 'pointer', fontWeight: filter === key ? 500 : 400,
                transition: 'all 0.12s',
                display: 'flex', alignItems: 'center', gap: 4,
            }}
        >
            {label}
            {key === 'risk' && riskCount > 0 && (
                <span style={{
                    background: isDark ? '#2E1A1A' : '#FFF5F5',
                    color: isDark ? '#F28B82' : '#C53030',
                    fontSize: 10, padding: '0px 5px', borderRadius: 8,
                }}>{riskCount}</span>
            )}
        </button>
    )

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {showModal && (
                <AddStudentModal
                    t={t} isDark={isDark} accent={accent}
                    onClose={() => setShowModal(false)}
                    onAdd={handleAdd}
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
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Мои ученики</span>
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
                        + Добавить ученика
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
                            placeholder="Поиск ученика..."
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

                    {/* Фильтры и сортировка */}
                    <div style={{ padding: '10px 14px', borderBottom: `1px solid ${t.border}` }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                            {groups.map(g => filterBtn(
                                g,
                                g === 'all' ? `Все (${students.length})` :
                                    g === 'risk' ? '⚠️ Зона риска' : g
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: t.textSecondary }}>Сортировка:</span>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                style={{
                                    fontSize: 11, padding: '3px 8px', borderRadius: 6,
                                    border: `1px solid ${t.border}`,
                                    background: isDark ? '#1E1F2E' : '#F4F6FA',
                                    color: t.text, outline: 'none', cursor: 'pointer',
                                }}
                            >
                                <option value="name">По имени</option>
                                <option value="score">По баллу</option>
                                <option value="tasks">По задачам</option>
                            </select>
                        </div>
                    </div>

                    {/* Список */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filtered.map(student => {
                            const isActive = selected?.id === student.id
                            return (
                                <div
                                    key={student.id}
                                    onClick={() => setSelected(student)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '11px 16px',
                                        borderBottom: `1px solid ${t.border}`,
                                        cursor: 'pointer',
                                        background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                        borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                                        transition: 'all 0.12s',
                                    }}
                                >
                                    <div style={{
                                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                                        background: getScoreBg(student.score, isDark),
                                        color: getScoreColor(student.score, isDark),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700,
                                    }}>
                                        {student.initials}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                          fontSize: 13, fontWeight: isActive ? 500 : 400,
                          color: isActive ? accent : t.text,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          maxWidth: 130,
                      }}>
                        {student.name}
                      </span>
                                            <span style={{
                                                fontSize: 12, fontWeight: 600,
                                                color: getScoreColor(student.score, isDark),
                                            }}>
                        {student.score}
                      </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <span style={{ fontSize: 11, color: t.textSecondary }}>
                        {student.group}
                      </span>
                                            {student.status === 'risk' && (
                                                <span style={{ fontSize: 10, color: isDark ? '#F28B82' : '#C53030' }}>⚠️</span>
                                            )}
                                            <div style={{ flex: 1, height: 4, borderRadius: 4, background: t.border }}>
                                                <div style={{
                                                    height: 4, borderRadius: 4,
                                                    background: getScoreColor(student.score, isDark),
                                                    width: `${student.score}%`,
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Правая панель */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {selected ? (
                        <StudentDetail student={selected} t={t} isDark={isDark} accent={accent} />
                    ) : (
                        <div style={{
                            height: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: t.textSecondary, fontSize: 14,
                        }}>
                            Выберите ученика
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}