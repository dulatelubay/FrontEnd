// Успеваемость — Цифровой тренажёр для учителей информатики

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Legend, RadarChart, Radar,
    PolarGrid, PolarAngleAxis,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'

// ─── Данные ──────────────────────────────────────────────────────────────────

const students = [
    { name: 'Айгерим Токова',   initials: 'АТ', score: 95, group: '7А', tasks: 12, topics: 10 },
    { name: 'Алия Муратова',    initials: 'АМ', score: 88, group: '7А', tasks: 11, topics: 8  },
    { name: 'Камила Ержанова',  initials: 'КЕ', score: 82, group: '7А', tasks: 10, topics: 7  },
    { name: 'Данияр Касымов',   initials: 'ДК', score: 74, group: '7А', tasks: 9,  topics: 6  },
    { name: 'Нурлан Абенов',    initials: 'НА', score: 55, group: '7Б', tasks: 6,  topics: 4  },
    { name: 'Зарина Нурланова', initials: 'ЗН', score: 61, group: '7Б', tasks: 7,  topics: 5  },
    { name: 'Бекзат Сейткали',  initials: 'БС', score: 43, group: '7Б', tasks: 4,  topics: 3  },
    { name: 'Арман Дюсенов',    initials: 'АД', score: 38, group: '7Б', tasks: 3,  topics: 2  },
]

const weeklyActivity = [
    { day: 'Пн', sessions: 14, tasks: 8  },
    { day: 'Вт', sessions: 22, tasks: 15 },
    { day: 'Ср', sessions: 18, tasks: 11 },
    { day: 'Чт', sessions: 28, tasks: 19 },
    { day: 'Пт', sessions: 20, tasks: 13 },
    { day: 'Сб', sessions: 7,  tasks: 4  },
    { day: 'Вс', sessions: 3,  tasks: 2  },
]

const monthlyProgress = [
    { month: 'Янв', avg: 48 },
    { month: 'Фев', avg: 55 },
    { month: 'Мар', avg: 61 },
    { month: 'Апр', avg: 67 },
    { month: 'Май', avg: 72 },
]

const topicStats = [
    { topic: 'Алгоритмы',      avgScore: 72, completed: 8, total: 8 },
    { topic: 'Типы данных',    avgScore: 68, completed: 7, total: 8 },
    { topic: 'Циклы',          avgScore: 65, completed: 6, total: 8 },
    { topic: 'Функции',        avgScore: 70, completed: 5, total: 8 },
    { topic: 'Списки',         avgScore: 63, completed: 4, total: 8 },
    { topic: 'ООП',            avgScore: 58, completed: 2, total: 8 },
    { topic: 'Рекурсия',       avgScore: 0,  completed: 0, total: 8 },
    { topic: 'Сортировки',     avgScore: 0,  completed: 0, total: 8 },
]

const radarData = [
    { subject: 'Алгоритмы', A: 72 },
    { subject: 'Типы данных', A: 68 },
    { subject: 'Циклы', A: 65 },
    { subject: 'Функции', A: 70 },
    { subject: 'Списки', A: 63 },
    { subject: 'ООП', A: 58 },
]

const scoreDistribution = [
    { range: '90–100', count: 1, label: 'Отлично' },
    { range: '80–89',  count: 2, label: 'Хорошо' },
    { range: '70–79',  count: 1, label: 'Выше среднего' },
    { range: '60–69',  count: 1, label: 'Средне' },
    { range: 'Ниже 60',count: 3, label: 'Нужна помощь' },
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

// ─── Кастомный Tooltip ───────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, t }) {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 8, padding: '8px 12px', fontSize: 12, color: t.text,
        }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </div>
            ))}
        </div>
    )
}

// ─── Компонент карточки статистики ────────────────────────────────────────────

function StatCard({ icon, value, label, sub, subColor, t, isDark }) {
    return (
        <div style={{
            background: isDark ? '#181926' : '#fff',
            border: `1px solid ${t.border}`,
            borderRadius: 12, padding: '16px 18px',
        }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: t.text }}>{value}</div>
            <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>{label}</div>
            {sub && (
                <div style={{ fontSize: 11, color: subColor || t.textSecondary, marginTop: 4 }}>{sub}</div>
            )}
        </div>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function Progress() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const [period, setPeriod] = useState('week')   // week | month
    const [group, setGroup]   = useState('all')    // all | 7А | 7Б

    const filteredStudents = group === 'all'
        ? students
        : students.filter(s => s.group === group)

    const avgScore = Math.round(
        filteredStudents.reduce((s, st) => s + st.score, 0) / filteredStudents.length
    )
    const riskCount   = filteredStudents.filter(s => s.score < 60).length
    const topStudents = [...filteredStudents].sort((a, b) => b.score - a.score).slice(0, 3)

    const chartData = period === 'week' ? weeklyActivity : monthlyProgress

    const gridColor  = isDark ? '#2A2D3E' : '#E2E8F0'
    const textColor  = isDark ? '#6C7086' : '#A0AEC0'

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Topbar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Link to="/" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>Главная</Link>
                    <span style={{ color: t.textSecondary, fontSize: 12 }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Успеваемость</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Фильтр группы */}
                    <div style={{ display: 'flex', gap: 4, background: isDark ? '#313244' : '#F4F6FA', borderRadius: 8, padding: 3 }}>
                        {['all', '7А', '7Б'].map(g => (
                            <button key={g} onClick={() => setGroup(g)} style={{
                                padding: '5px 12px', borderRadius: 6, fontSize: 11, border: 'none',
                                background: group === g ? (isDark ? '#CDD6F4' : '#1A202C') : 'transparent',
                                color: group === g ? (isDark ? '#1E1F2E' : '#fff') : t.textSecondary,
                                cursor: 'pointer', fontWeight: group === g ? 500 : 400,
                                transition: 'all 0.15s',
                            }}>
                                {g === 'all' ? 'Все классы' : g}
                            </button>
                        ))}
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div style={{ padding: '22px 24px', flex: 1 }}>

                {/* ── Стат-карточки ── */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 14, marginBottom: 22,
                }}>
                    <StatCard icon="👥" value={filteredStudents.length} label="Учеников"          t={t} isDark={isDark} />
                    <StatCard icon="📊" value={avgScore}                label="Средний балл"
                              sub={avgScore >= 70 ? '↑ Выше нормы' : '↓ Ниже нормы'}
                              subColor={avgScore >= 70 ? (isDark ? '#A6E3A1' : '#276749') : (isDark ? '#F28B82' : '#C53030')}
                              t={t} isDark={isDark}
                    />
                    <StatCard icon="⚠️" value={riskCount}              label="В зоне риска"
                              sub="Балл ниже 60"
                              subColor={isDark ? '#F28B82' : '#C53030'}
                              t={t} isDark={isDark}
                    />
                    <StatCard icon="✅" value="61%"                     label="Сдано заданий"
                              sub="148 / 240"
                              t={t} isDark={isDark}
                    />
                </div>

                {/* ── Ряд 1: Активность + Распределение баллов ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

                    {/* График активности */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: '18px 20px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Активность класса</div>
                            <div style={{ display: 'flex', gap: 4, background: isDark ? '#313244' : '#F4F6FA', borderRadius: 7, padding: 3 }}>
                                {['week', 'month'].map(p => (
                                    <button key={p} onClick={() => setPeriod(p)} style={{
                                        padding: '4px 10px', borderRadius: 5, fontSize: 11, border: 'none',
                                        background: period === p ? accent : 'transparent',
                                        color: period === p ? '#fff' : t.textSecondary,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}>
                                        {p === 'week' ? 'Неделя' : 'Месяц'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            {period === 'week' ? (
                                <BarChart data={weeklyActivity} barSize={14} barGap={4}>
                                    <CartesianGrid vertical={false} stroke={gridColor} />
                                    <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                                    <Tooltip content={<CustomTooltip t={t} />} />
                                    <Legend wrapperStyle={{ fontSize: 11, color: t.textSecondary }} />
                                    <Bar dataKey="sessions" name="Сессии Colab" fill={accent} opacity={0.85} radius={[3,3,0,0]} />
                                    <Bar dataKey="tasks"    name="Задачи"       fill={isDark ? '#A6E3A1' : '#48BB78'} opacity={0.75} radius={[3,3,0,0]} />
                                </BarChart>
                            ) : (
                                <LineChart data={monthlyProgress}>
                                    <CartesianGrid stroke={gridColor} />
                                    <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} domain={[40,80]} width={30} />
                                    <Tooltip content={<CustomTooltip t={t} />} />
                                    <Line
                                        type="monotone" dataKey="avg" name="Средний балл"
                                        stroke={accent} strokeWidth={2.5}
                                        dot={{ fill: accent, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    {/* Распределение баллов */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: '18px 20px',
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>
                            Распределение баллов
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {scoreDistribution.map((item, i) => {
                                const pct = (item.count / filteredStudents.length) * 100
                                const colors = [
                                    { bar: isDark ? '#A6E3A1' : '#48BB78', bg: isDark ? '#1A3A2A' : '#E6FFEE', text: isDark ? '#A6E3A1' : '#276749' },
                                    { bar: isDark ? '#89B4FA' : '#1A6EFF', bg: isDark ? '#1E3A5F' : '#EBF4FF', text: isDark ? '#89B4FA' : '#1A6EFF' },
                                    { bar: isDark ? '#89B4FA' : '#4A9EFF', bg: isDark ? '#1E3A5F' : '#EBF4FF', text: isDark ? '#89B4FA' : '#1A6EFF' },
                                    { bar: isDark ? '#F9E2AF' : '#ECC94B', bg: isDark ? '#3A2E10' : '#FFFBEB', text: isDark ? '#F9E2AF' : '#975A16' },
                                    { bar: isDark ? '#F28B82' : '#FC8181', bg: isDark ? '#2E1A1A' : '#FFF5F5', text: isDark ? '#F28B82' : '#C53030' },
                                ][i]
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 70, fontSize: 11, color: t.textSecondary, flexShrink: 0 }}>
                                            {item.range}
                                        </div>
                                        <div style={{ flex: 1, height: 20, borderRadius: 6, background: isDark ? '#313244' : '#F4F6FA', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${Math.max(pct, 4)}%`, height: '100%',
                                                background: colors.bar, borderRadius: 6,
                                                display: 'flex', alignItems: 'center',
                                                paddingLeft: 8, transition: 'width 0.4s',
                                            }}>
                                                {pct > 15 && (
                                                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 500 }}>
                            {item.count} уч.
                          </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: 11, fontWeight: 600, flexShrink: 0,
                                            color: colors.text,
                                            background: colors.bg,
                                            padding: '2px 8px', borderRadius: 6,
                                            minWidth: 40, textAlign: 'center',
                                        }}>
                                            {item.count}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Ряд 2: Успеваемость по темам + Радар ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>

                    {/* По темам */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: '18px 20px',
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>
                            Успеваемость по темам
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                            {topicStats.map((topic, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 100, fontSize: 11, color: t.text, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {topic.topic}
                                    </div>
                                    <div style={{ flex: 1, height: 8, borderRadius: 10, background: isDark ? '#313244' : '#F4F6FA' }}>
                                        <div style={{
                                            height: 8, borderRadius: 10,
                                            background: topic.avgScore >= 70 ? accent
                                                : topic.avgScore >= 60 ? (isDark ? '#F9E2AF' : '#ECC94B')
                                                    : topic.avgScore > 0 ? (isDark ? '#F28B82' : '#FC8181')
                                                        : t.border,
                                            width: `${topic.avgScore}%`,
                                            transition: 'width 0.5s',
                                        }} />
                                    </div>
                                    <div style={{ width: 36, fontSize: 11, fontWeight: 600, textAlign: 'right',
                                        color: topic.avgScore > 0 ? t.text : t.textSecondary,
                                    }}>
                                        {topic.avgScore > 0 ? `${topic.avgScore}%` : '—'}
                                    </div>
                                    <div style={{ width: 36, fontSize: 10, color: t.textSecondary, textAlign: 'right', flexShrink: 0 }}>
                                        {topic.completed}/{topic.total}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Радар-чарт */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 12, padding: '18px 20px',
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>
                            Профиль знаний класса
                        </div>
                        <ResponsiveContainer width="100%" height={210}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke={gridColor} />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fill: textColor, fontSize: 10 }}
                                />
                                <Radar
                                    name="Средний балл"
                                    dataKey="A"
                                    stroke={accent}
                                    fill={accent}
                                    fillOpacity={0.25}
                                    strokeWidth={2}
                                />
                                <Tooltip content={<CustomTooltip t={t} />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Ряд 3: Таблица учеников ── */}
                <div style={{
                    background: isDark ? '#181926' : '#fff',
                    border: `1px solid ${t.border}`,
                    borderRadius: 12, padding: '18px 20px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>
                            Рейтинг учеников
                        </div>
                        <Link to="/students" style={{ fontSize: 12, color: accent, textDecoration: 'none' }}>
                            Все ученики →
                        </Link>
                    </div>

                    {/* Заголовок таблицы */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '30px 1fr 80px 120px 100px 80px',
                        gap: 12, padding: '6px 12px',
                        borderBottom: `1px solid ${t.border}`,
                        marginBottom: 6,
                    }}>
                        {['#', 'Ученик', 'Класс', 'Задачи', 'Прогресс', 'Балл'].map((h, i) => (
                            <div key={i} style={{ fontSize: 11, color: t.textSecondary, fontWeight: 500 }}>{h}</div>
                        ))}
                    </div>

                    {/* Строки */}
                    {[...filteredStudents]
                        .sort((a, b) => b.score - a.score)
                        .map((student, i) => (
                            <div
                                key={student.name}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '30px 1fr 80px 120px 100px 80px',
                                    gap: 12, padding: '10px 12px',
                                    borderRadius: 8,
                                    background: i % 2 === 0
                                        ? 'transparent'
                                        : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'),
                                    alignItems: 'center',
                                    transition: 'background 0.12s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1E1F2E' : '#F4F6FA'}
                                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)')}
                            >
                                {/* Место */}
                                <div style={{
                                    fontSize: 12, fontWeight: 700,
                                    color: i === 0 ? '#F9AB00' : i === 1 ? '#A0AEC0' : i === 2 ? '#CD7F32' : t.textSecondary,
                                }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                                </div>

                                {/* Имя */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                        background: getScoreBg(student.score, isDark),
                                        color: getScoreColor(student.score, isDark),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 700,
                                    }}>
                                        {student.initials}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, color: t.text }}>{student.name}</div>
                                        {student.score < 60 && (
                                            <div style={{ fontSize: 10, color: isDark ? '#F28B82' : '#C53030' }}>⚠️ Зона риска</div>
                                        )}
                                    </div>
                                </div>

                                {/* Класс */}
                                <div style={{ fontSize: 12, color: t.textSecondary }}>{student.group}</div>

                                {/* Задачи */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ flex: 1, height: 5, borderRadius: 10, background: t.border }}>
                                        <div style={{
                                            height: 5, borderRadius: 10, background: accent,
                                            width: `${(student.tasks / 12) * 100}%`,
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: t.textSecondary, flexShrink: 0 }}>
                  {student.tasks}/12
                </span>
                                </div>

                                {/* Темы */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ flex: 1, height: 5, borderRadius: 10, background: t.border }}>
                                        <div style={{
                                            height: 5, borderRadius: 10,
                                            background: isDark ? '#A6E3A1' : '#48BB78',
                                            width: `${(student.topics / 12) * 100}%`,
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: t.textSecondary, flexShrink: 0 }}>
                  {student.topics}/12
                </span>
                                </div>

                                {/* Балл */}
                                <div style={{
                                    fontSize: 14, fontWeight: 700,
                                    color: getScoreColor(student.score, isDark),
                                    background: getScoreBg(student.score, isDark),
                                    padding: '3px 10px', borderRadius: 8,
                                    textAlign: 'center',
                                }}>
                                    {student.score}
                                </div>
                            </div>
                        ))}
                </div>

            </div>
        </div>
    )
}