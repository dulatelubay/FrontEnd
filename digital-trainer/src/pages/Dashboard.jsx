// src/pages/Dashboard.jsx
// Главная страница — Цифровой тренажёр для учителей информатики
// Использует: ThemeContext из ../context/ThemeContext, themes из ../styles/themes
// Зависимости: react-router-dom (для Link), recharts (для графика)

import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'

// ─── Данные ──────────────────────────────────────────────────────────────────

const activityData = [
    { day: 'Пн', value: 42 },
    { day: 'Вт', value: 80 },
    { day: 'Ср', value: 55 },
    { day: 'Чт', value: 93 },
    { day: 'Пт', value: 67 },
    { day: 'Сб', value: 24 },
    { day: 'Вс', value: 10 },
]

const students = [
    { initials: 'АМ', name: 'Алия Муратова',    score: 88, color: '#1A6EFF' },
    { initials: 'ДК', name: 'Данияр Касымов',   score: 74, color: '#48BB78' },
    { initials: 'ЗН', name: 'Зарина Нурланова', score: 61, color: '#ECC94B' },
    { initials: 'БС', name: 'Бекзат Сейткали',  score: 43, color: '#FC8181' },
]

const modules = [
    {
        to: '/theory',
        icon: '☰',
        iconBgLight: '#EBF4FF', iconColorLight: '#1A6EFF',
        iconBgDark:  '#1E3A5F', iconColorDark:  '#89B4FA',
        name: 'Теория и методика',
        count: '12 тем',
        pill: '70%',
        pillBgLight: '#EBF4FF', pillColorLight: '#1A6EFF',
        pillBgDark:  '#1E3A5F', pillColorDark:  '#89B4FA',
    },
    {
        to: '/sandbox',
        icon: '>_',
        iconBgLight: '#E6FFEE', iconColorLight: '#276749',
        iconBgDark:  '#1A3A2A', iconColorDark:  '#A6E3A1',
        name: 'Песочница',
        count: 'Google Colab',
        pill: 'Live',
        pillBgLight: '#E6FFEE', pillColorLight: '#276749',
        pillBgDark:  '#1A3A2A', pillColorDark:  '#A6E3A1',
    },
    {
        to: '/lessons',
        icon: '📋',
        iconBgLight: '#FFFBEB', iconColorLight: '#975A16',
        iconBgDark:  '#3A2E10', iconColorDark:  '#F9E2AF',
        name: 'Планы уроков',
        count: '6 планов',
        pill: '40%',
        pillBgLight: '#FFFBEB', pillColorLight: '#975A16',
        pillBgDark:  '#3A2E10', pillColorDark:  '#F9E2AF',
    },
    {
        to: '/tasks',
        icon: '✓',
        iconBgLight: '#FFF5F5', iconColorLight: '#C53030',
        iconBgDark:  '#2E1A3A', iconColorDark:  '#CBA6F7',
        name: 'Задания',
        count: '34 упражнения',
        pill: '5 новых',
        pillBgLight: '#FFF5F5', pillColorLight: '#C53030',
        pillBgDark:  '#2E1A3A', pillColorDark:  '#CBA6F7',
    },
]

// ─── Вспомогательные компоненты ──────────────────────────────────────────────

function StatCard({ label, value, sub, subColor, t }) {
    return (
        <div style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: '13px 14px',
        }}>
            <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.text }}>{value}</div>
            <div style={{ fontSize: 11, marginTop: 3, color: subColor || t.textSecondary }}>{sub}</div>
        </div>
    )
}

function ModuleRow({ mod, t, isDark }) {
    const iconBg    = isDark ? mod.iconBgDark    : mod.iconBgLight
    const iconColor = isDark ? mod.iconColorDark : mod.iconColorLight
    const pillBg    = isDark ? mod.pillBgDark    : mod.pillBgLight
    const pillColor = isDark ? mod.pillColorDark : mod.pillColorLight

    return (
        <Link to={mod.to} style={{ textDecoration: 'none' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 11px',
                borderRadius: 8,
                background: isDark ? '#1E1F2E' : '#FAFBFC',
                border: `1px solid ${t.border}`,
                cursor: 'pointer',
                transition: 'opacity 0.12s',
            }}
                 onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                 onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
                <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: iconBg, color: iconColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600, flexShrink: 0,
                }}>
                    {mod.icon}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{mod.name}</div>
                    <div style={{ fontSize: 11, color: t.textSecondary }}>{mod.count}</div>
                </div>
                <div style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 6, fontWeight: 500,
                    background: pillBg, color: pillColor, flexShrink: 0,
                }}>
                    {mod.pill}
                </div>
            </div>
        </Link>
    )
}

function StudentRow({ student, t }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: student.color + '22',
                color: student.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, flexShrink: 0,
            }}>
                {student.initials}
            </div>
            <div style={{ fontSize: 12, color: t.text, flex: 1 }}>{student.name}</div>
            <div style={{
                width: 90, height: 6, borderRadius: 10,
                background: t.border, flexShrink: 0,
            }}>
                <div style={{
                    width: `${student.score}%`,
                    height: 6, borderRadius: 10,
                    background: student.color,
                    transition: 'width 0.6s ease',
                }} />
            </div>
            <div style={{ fontSize: 11, color: t.textSecondary, minWidth: 30, textAlign: 'right' }}>
                {student.score}%
            </div>
        </div>
    )
}

// ─── Главная страница ─────────────────────────────────────────────────────────

export default function Dashboard() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'

    const accentColor = isDark ? '#89B4FA' : '#1A6EFF'

    // Кастомный tooltip для графика
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    borderRadius: 7,
                    padding: '6px 10px',
                    fontSize: 11,
                    color: t.text,
                }}>
                    <strong>{label}</strong>: {payload[0].value} действий
                </div>
            )
        }
        return null
    }

    return (
        <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* ── Topbar ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>Главная</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ThemeToggle />
                    <button style={{
                        padding: '7px 14px', borderRadius: 8, fontSize: 12,
                        border: `1px solid ${t.border}`,
                        background: 'transparent', color: t.textSecondary,
                        cursor: 'pointer',
                    }}>
                        Импорт
                    </button>
                    <button style={{
                        padding: '7px 14px', borderRadius: 8, fontSize: 12,
                        border: 'none',
                        background: accentColor, color: '#fff',
                        fontWeight: 500, cursor: 'pointer',
                    }}>
                        + Новый урок
                    </button>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ padding: '22px 24px', flex: 1 }}>

                {/* Welcome banner */}
                <div style={{
                    background: accentColor,
                    borderRadius: 12,
                    padding: '16px 22px',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 3 }}>
                            Добрый день, Айгерим!
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                            У вас 5 новых заданий на проверку сегодня
                        </div>
                    </div>
                    <Link to="/tasks" style={{ textDecoration: 'none' }}>
                        <button style={{
                            padding: '7px 16px',
                            borderRadius: 8,
                            background: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            fontSize: 12,
                            border: '1px solid rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}>
                            Перейти к проверке →
                        </button>
                    </Link>
                </div>

                {/* Stat cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12,
                    marginBottom: 20,
                }}>
                    <StatCard label="Учеников"      value="24"  sub="2 группы"    t={t} />
                    <StatCard label="Уроков создано" value="18" sub="↑ 3 за неделю" subColor="#48BB78" t={t} />
                    <StatCard label="Сдано заданий" value="61%" sub="148 / 240"   t={t} />
                    <StatCard label="Сессий Colab"  value="39"  sub="за месяц"    t={t} />
                </div>

                {/* Row: Modules + Chart */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                    marginBottom: 16,
                }}>

                    {/* Modules */}
                    <div style={{
                        background: t.card,
                        border: `1px solid ${t.border}`,
                        borderRadius: 12,
                        padding: 16,
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 12,
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Модули</div>
                            <Link to="/theory" style={{ fontSize: 12, color: accentColor, textDecoration: 'none' }}>
                                Все →
                            </Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {modules.map(mod => (
                                <ModuleRow key={mod.to} mod={mod} t={t} isDark={isDark} />
                            ))}
                        </div>
                    </div>

                    {/* Activity chart */}
                    <div style={{
                        background: t.card,
                        border: `1px solid ${t.border}`,
                        borderRadius: 12,
                        padding: 16,
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 14,
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Активность класса</div>
                            <Link to="/progress" style={{ fontSize: 12, color: accentColor, textDecoration: 'none' }}>
                                Подробнее →
                            </Link>
                        </div>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={activityData} barSize={22}>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fill: t.textSecondary, fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                <Bar
                                    dataKey="value"
                                    fill={accentColor}
                                    radius={[4, 4, 0, 0]}
                                    opacity={0.85}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: t.textSecondary }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: accentColor }} />
                                Активность учеников
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student progress */}
                <div style={{
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    borderRadius: 12,
                    padding: 16,
                }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 14,
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>
                            Успеваемость учеников{' '}
                            <span style={{ fontSize: 11, fontWeight: 400, color: t.textSecondary }}>
                (только учитель)
              </span>
                        </div>
                        <Link to="/progress" style={{ fontSize: 12, color: accentColor, textDecoration: 'none' }}>
                            Весь класс →
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {students.map(s => (
                            <StudentRow key={s.name} student={s} t={t} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}