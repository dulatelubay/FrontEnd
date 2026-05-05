import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@uiw/react-codemirror'

// ─── Данные ──────────────────────────────────────────────────────────────────

const notebooks = [
    {
        id: 1,
        title: 'Алгоритмы — введение',
        topic: 'Алгоритмы',
        grade: '7 класс',
        sessions: 39,
        lastUsed: '24 апр 2026',
        duration: '20 мин',
        description: 'Практическое занятие по основам алгоритмов. Ученики пишут свои первые алгоритмы на Python — поиск максимума, минимума, суммы элементов.',
        colabUrl: 'https://colab.research.google.com/drive/new',
        tasks: [
            { done: true,  text: 'Написать алгоритм поиска максимума' },
            { done: true,  text: 'Написать алгоритм поиска минимума' },
            { done: false, text: 'Написать алгоритм суммирования списка' },
            { done: false, text: 'Реализовать алгоритм подсчёта чётных чисел' },
        ],
        code: `# Занятие 1: Алгоритмы — введение
# ======================================

# Задача 1: Найти максимум (без встроенной функции)
def найти_максимум(список):
    # Напишите код здесь
    pass

# Задача 2: Найти минимум
def найти_минимум(список):
    # Напишите код здесь
    pass

# Задача 3: Сумма элементов
def сумма_списка(список):
    # Напишите код здесь
    pass

# Тест
числа = [3, 7, 1, 9, 4, 6, 2]
print("Максимум:", найти_максимум(числа))
print("Минимум:", найти_минимум(числа))
print("Сумма:", сумма_списка(числа))`,
    },
    {
        id: 2,
        title: 'Типы данных — эксперименты',
        topic: 'Типы данных',
        grade: '7 класс',
        sessions: 28,
        lastUsed: '22 апр 2026',
        duration: '15 мин',
        description: 'Ученики экспериментируют с разными типами данных Python, изучают преобразование типов и функцию type().',
        colabUrl: 'https://colab.research.google.com/drive/new',
        tasks: [
            { done: true,  text: 'Создать переменные всех базовых типов' },
            { done: true,  text: 'Использовать функцию type()' },
            { done: false, text: 'Выполнить преобразования типов' },
            { done: false, text: 'Найти что будет при сложении str + int' },
        ],
        code: `# Занятие 2: Типы данных
# ======================================

# Задача 1: Создайте по одной переменной каждого типа
целое = ???
дробное = ???
строка = ???
булево = ???

# Задача 2: Выведите тип каждой переменной
print(type(целое))
print(type(дробное))

# Задача 3: Преобразования типов
число_как_строка = str(42)
строка_как_число = int("100")
print(число_как_строка, type(число_как_строка))

# Задача 4: Что произойдёт здесь? Попробуйте!
# print("5" + 5)`,
    },
    {
        id: 3,
        title: 'Условия и циклы — практика',
        topic: 'Условия и циклы',
        grade: '8 класс',
        sessions: 21,
        lastUsed: '20 апр 2026',
        duration: '25 мин',
        description: 'Практическая работа с условными операторами и циклами. Написание реальных программ с использованием if/elif/else и for/while.',
        colabUrl: 'https://colab.research.google.com/drive/new',
        tasks: [
            { done: true,  text: 'Программа определения оценки по баллам' },
            { done: false, text: 'Цикл for — вывод таблицы умножения' },
            { done: false, text: 'Цикл while — угадай число' },
            { done: false, text: 'Комбинированная задача с условием и циклом' },
        ],
        code: `# Занятие 3: Условия и циклы
# ======================================

# Задача 1: Определить оценку по баллам
def определить_оценку(балл):
    if балл >= 90:
        return "Отлично"
    elif балл >= 70:
        # Допишите условия
        pass
    else:
        pass

# Задача 2: Таблица умножения числа
число = 7
for i in range(1, 11):
    # Выведите: "7 x 1 = 7", "7 x 2 = 14" ...
    pass

# Задача 3: Сумма чисел от 1 до N
N = 100
сумма = 0
# Используйте цикл while
print(f"Сумма от 1 до {N} =", сумма)`,
    },
    {
        id: 4,
        title: 'Функции — калькулятор',
        topic: 'Функции',
        grade: '8 класс',
        sessions: 18,
        lastUsed: '18 апр 2026',
        duration: '20 мин',
        description: 'Создание полноценного калькулятора с использованием функций. Ученики учатся разбивать программу на логические блоки.',
        colabUrl: 'https://colab.research.google.com/drive/new',
        tasks: [
            { done: true,  text: 'Функции сложения и вычитания' },
            { done: true,  text: 'Функции умножения и деления' },
            { done: false, text: 'Обработка деления на ноль' },
            { done: false, text: 'Интерфейс выбора операции' },
        ],
        code: `# Занятие 4: Калькулятор с функциями
# ======================================

# Задача 1: Напишите 4 функции
def сложить(a, b):
    pass

def вычесть(a, b):
    pass

def умножить(a, b):
    pass

def разделить(a, b):
    # Не забудьте про деление на ноль!
    pass

# Задача 2: Калькулятор
def калькулятор(a, операция, b):
    if операция == '+':
        return сложить(a, b)
    # Допишите остальные операции

# Тест
print(калькулятор(10, '+', 5))   # 15
print(калькулятор(10, '/', 0))   # Ошибка!`,
    },
    {
        id: 5,
        title: 'Списки — работа с данными',
        topic: 'Массивы и списки',
        grade: '9 класс',
        sessions: 15,
        lastUsed: '15 апр 2026',
        duration: '25 мин',
        description: 'Работа со списками: создание, индексация, методы, перебор. Реальная задача — работа со списком студентов и оценками.',
        colabUrl: 'https://colab.research.google.com/drive/new',
        tasks: [
            { done: true,  text: 'Создать список студентов' },
            { done: false, text: 'Добавить и удалить студентов' },
            { done: false, text: 'Найти студента с максимальной оценкой' },
            { done: false, text: 'Отсортировать по оценке' },
        ],
        code: `# Занятие 5: Работа со списками
# ======================================

# Данные класса
студенты = ["Алия", "Данияр", "Зарина", "Бекзат", "Айгерим"]
оценки = [88, 74, 61, 43, 95]

# Задача 1: Вывести список с оценками
for i in range(len(студенты)):
    print(f"{студенты[i]}: {оценки[i]}")

# Задача 2: Найти отличников (оценка >= 80)
отличники = []
# Заполните список

# Задача 3: Средняя оценка
средняя = sum(оценки) / len(оценки)
print(f"Средняя оценка: {средняя:.1f}")

# Задача 4: Кто лучший ученик?
макс_индекс = оценки.index(max(оценки))
print(f"Лучший: {студенты[макс_индекс]}")`,
    },
    {
        id: 6,
        title: 'ООП — класс Студент',
        topic: 'ООП',
        grade: '9 класс',
        sessions: 11,
        lastUsed: '10 апр 2026',
        duration: '30 мин',
        description: 'Создание первого класса. Ученики реализуют класс Студент с атрибутами и методами, создают объекты и работают с ними.',
        colabUrl: 'https://colab.research.google.com/drive/new',
        tasks: [
            { done: false, text: 'Создать класс Студент' },
            { done: false, text: 'Добавить метод статус()' },
            { done: false, text: 'Создать список объектов' },
            { done: false, text: 'Найти лучшего студента через методы' },
        ],
        code: `# Занятие 6: ООП — класс Студент
# ======================================

class Студент:
    def __init__(self, имя, оценка):
        # Инициализируйте атрибуты
        pass
    
    def статус(self):
        # Верните "сдал" если оценка >= 60, иначе "не сдал"
        pass
    
    def __str__(self):
        # Верните строку вида "Алия: 88 баллов"
        pass

# Создайте список студентов
студенты = [
    Студент("Алия", 88),
    Студент("Данияр", 74),
    Студент("Зарина", 61),
    Студент("Бекзат", 43),
]

# Выведите всех студентов и их статус
for ст in студенты:
    print(ст, "—", ст.статус())`,
    },
]

// ─── Вспомогательные компоненты ──────────────────────────────────────────────

function StatCard({ icon, value, label, t, isDark, accent }) {
    return (
        <div style={{
            background: isDark ? '#181926' : '#fff',
            border: `1px solid ${t.border}`,
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
        }}>
            <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: isDark ? '#1E3A5F' : '#EBF4FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 20, fontWeight: 600, color: t.text }}>{value}</div>
                <div style={{ fontSize: 11, color: t.textSecondary }}>{label}</div>
            </div>
        </div>
    )
}

// ─── Детали ноутбука ─────────────────────────────────────────────────────────

function NotebookDetail({ nb, t, isDark, accent }) {
    const [activeTab, setActiveTab] = useState('overview')
    const [copied, setCopied] = useState(false)

    function handleCopy() {
        navigator.clipboard.writeText(nb.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function openColab() {
        window.open(nb.colabUrl, '_blank')
    }

    const tabStyle = (tab) => ({
        padding: '8px 16px', fontSize: 12, cursor: 'pointer',
        border: 'none', background: 'transparent',
        color: activeTab === tab ? accent : t.textSecondary,
        borderBottom: activeTab === tab ? `2px solid ${accent}` : '2px solid transparent',
        fontWeight: activeTab === tab ? 500 : 400,
        transition: 'all 0.12s',
    })

    const completedTasks = nb.tasks.filter(t => t.done).length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Заголовок */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 5,
                  background: isDark ? '#1E3A5F' : '#EBF4FF', color: accent, fontWeight: 500,
              }}>{nb.topic}</span>
                            <span style={{
                                fontSize: 10, padding: '3px 8px', borderRadius: 5,
                                background: isDark ? '#181926' : '#F4F6FA',
                                color: t.textSecondary, border: `1px solid ${t.border}`,
                            }}>{nb.grade}</span>
                            <span style={{
                                fontSize: 10, padding: '3px 8px', borderRadius: 5,
                                background: isDark ? '#181926' : '#F4F6FA',
                                color: t.textSecondary, border: `1px solid ${t.border}`,
                            }}>⏱ {nb.duration}</span>
                        </div>
                        <h2 style={{ fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                            {nb.title}
                        </h2>
                        <p style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>
                            {nb.description}
                        </p>
                    </div>

                    {/* Кнопка открыть Colab */}
                    <button
                        onClick={openColab}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 10, fontSize: 13,
                            background: '#F9AB00',
                            color: '#fff', border: 'none',
                            fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8,
                            flexShrink: 0, whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(249,171,0,0.4)',
                        }}
                    >
                        <span style={{ fontSize: 16 }}>▶</span>
                        Открыть в Colab
                    </button>
                </div>

                {/* Статистика */}
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: t.textSecondary }}>
            👥 {nb.sessions} сессий
          </span>
                    <span style={{ fontSize: 12, color: t.textSecondary }}>
            📅 Последний раз: {nb.lastUsed}
          </span>
                    <span style={{ fontSize: 12, color: t.textSecondary }}>
            ✅ {completedTasks}/{nb.tasks.length} задач
          </span>
                </div>
            </div>

            {/* Табы */}
            <div style={{
                display: 'flex',
                borderBottom: `1px solid ${t.border}`,
                background: isDark ? '#13141F' : '#fff',
                paddingLeft: 8,
            }}>
                <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Обзор</button>
                <button style={tabStyle('code')} onClick={() => setActiveTab('code')}>Код шаблона</button>
            </div>

            {/* Контент */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

                {activeTab === 'overview' && (
                    <div>
                        {/* Прогресс задач */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Задачи занятия</span>
                                <span style={{ fontSize: 12, color: accent }}>
                  {completedTasks}/{nb.tasks.length} выполнено
                </span>
                            </div>
                            <div style={{ height: 6, borderRadius: 10, background: t.border, marginBottom: 14 }}>
                                <div style={{
                                    height: 6, borderRadius: 10, background: accent,
                                    width: `${(completedTasks / nb.tasks.length) * 100}%`,
                                    transition: 'width 0.4s',
                                }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {nb.tasks.map((task, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 14px',
                                        background: isDark ? '#181926' : '#fff',
                                        border: `1px solid ${t.border}`,
                                        borderRadius: 8,
                                    }}>
                                        <div style={{
                                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                            background: task.done
                                                ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                                : t.border,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 11,
                                        }}>
                                            {task.done
                                                ? <span style={{ color: isDark ? '#A6E3A1' : '#276749' }}>✓</span>
                                                : <span style={{ color: t.textSecondary }}>{i + 1}</span>
                                            }
                                        </div>
                                        <span style={{
                                            fontSize: 12,
                                            color: task.done ? t.textSecondary : t.text,
                                            textDecoration: task.done ? 'line-through' : 'none',
                                        }}>
                      {task.text}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Инструкция */}
                        <div style={{
                            background: isDark ? '#1E3A5F' : '#EBF4FF',
                            border: `1px solid ${isDark ? '#2A4A7A' : '#BED7FF'}`,
                            borderRadius: 10, padding: 16,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: accent, marginBottom: 8 }}>
                                📋 Как провести занятие
                            </div>
                            <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[
                                    'Нажмите "Открыть в Colab" — откроется новая вкладка',
                                    'Поделитесь ссылкой с учениками через Google Classroom или мессенджер',
                                    'Ученики делают копию ("Файл → Сохранить копию на Диске")',
                                    'Все работают в своих копиях, вы наблюдаете',
                                    'По окончании ученики отправляют ссылку на свою работу',
                                ].map((step, i) => (
                                    <li key={i} style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div>
                        <div style={{
                            borderRadius: 10, overflow: 'hidden',
                            border: '1px solid #313244',
                        }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '8px 14px',
                                background: '#1A202C',
                            }}>
                                <span style={{
                                    fontSize: 10, padding: '2px 8px', borderRadius: 4,
                                    background: '#2D3748', color: '#A6ADC8',
                                }}>
                                    Python — Шаблон для учеников
                                </span>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        fontSize: 10, padding: '3px 10px', borderRadius: 5, border: 'none',
                                        background: copied ? '#1A3A2A' : '#2D3748',
                                        color: copied ? '#A6E3A1' : '#A6ADC8',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >
                                    {copied ? '✓ Скопировано' : 'Копировать'}
                                </button>
                            </div>
                            <CodeMirror
                                value={nb.code}
                                extensions={[python()]}
                                theme={oneDark}
                                readOnly
                                editable={false}
                                basicSetup={{ lineNumbers: true, foldGutter: false }}
                                style={{ fontSize: 13 }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function Sandbox() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const [selectedNb, setSelectedNb] = useState(notebooks[0])
    const [search, setSearch] = useState('')

    const filtered = notebooks.filter(nb =>
        nb.title.toLowerCase().includes(search.toLowerCase()) ||
        nb.topic.toLowerCase().includes(search.toLowerCase())
    )

    const totalSessions = notebooks.reduce((s, nb) => s + nb.sessions, 0)

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
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Песочница</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ThemeToggle />
                    <button
                        onClick={() => window.open('https://colab.research.google.com/drive/new', '_blank')}
                        style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 12,
                            background: '#F9AB00', color: '#fff', border: 'none',
                            fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        <span>▶</span> Новая сессия Colab
                    </button>
                </div>
            </div>

            {/* Статистика */}
            <div style={{
                padding: '16px 22px',
                background: isDark ? '#13141F' : '#fff',
                borderBottom: `1px solid ${t.border}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
            }}>
                <StatCard icon="💻" value={notebooks.length}   label="Шаблонов"          t={t} isDark={isDark} accent={accent} />
                <StatCard icon="👥" value={totalSessions}       label="Всего сессий"       t={t} isDark={isDark} accent={accent} />
                <StatCard icon="📅" value="24 апр"              label="Последняя сессия"   t={t} isDark={isDark} accent={accent} />
                <StatCard icon="⏱" value="~22 мин"             label="Среднее время"       t={t} isDark={isDark} accent={accent} />
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Левая панель */}
                <div style={{
                    width: 280, minWidth: 280,
                    background: isDark ? '#13141F' : '#fff',
                    borderRight: `1px solid ${t.border}`,
                    display: 'flex', flexDirection: 'column',
                }}>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}` }}>
                        <input
                            placeholder="Поиск шаблонов..."
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

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filtered.map(nb => {
                            const isActive = selectedNb?.id === nb.id
                            const completed = nb.tasks.filter(t => t.done).length
                            return (
                                <div
                                    key={nb.id}
                                    onClick={() => setSelectedNb(nb)}
                                    style={{
                                        padding: '13px 16px',
                                        borderBottom: `1px solid ${t.border}`,
                                        cursor: 'pointer',
                                        background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                        borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                                        transition: 'all 0.12s',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{
                        fontSize: 13, fontWeight: isActive ? 500 : 400,
                        color: isActive ? accent : t.text,
                        flex: 1, lineHeight: 1.4,
                    }}>
                      {nb.title}
                    </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>{nb.grade}</span>
                                        <span style={{ color: t.border }}>·</span>
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>⏱ {nb.duration}</span>
                                        <span style={{ color: t.border }}>·</span>
                                        <span style={{ fontSize: 11, color: t.textSecondary }}>👥 {nb.sessions}</span>
                                    </div>
                                    {/* Прогресс задач */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ flex: 1, height: 4, borderRadius: 4, background: t.border }}>
                                            <div style={{
                                                height: 4, borderRadius: 4, background: accent,
                                                width: `${(completed / nb.tasks.length) * 100}%`,
                                                opacity: isActive ? 1 : 0.6,
                                            }} />
                                        </div>
                                        <span style={{ fontSize: 10, color: t.textSecondary, flexShrink: 0 }}>
                      {completed}/{nb.tasks.length}
                    </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Правая панель */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {selectedNb ? (
                        <NotebookDetail nb={selectedNb} t={t} isDark={isDark} accent={accent} />
                    ) : (
                        <div style={{
                            height: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: t.textSecondary, fontSize: 14,
                        }}>
                            Выберите шаблон
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}