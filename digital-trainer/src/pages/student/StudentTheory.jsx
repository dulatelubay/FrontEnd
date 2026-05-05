// src/pages/student/StudentTheory.jsx
// Теория для ученика — только чтение, без добавления тем

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { themes } from '../../styles/themes'
import ThemeToggle from '../../components/ThemeToggle'

// ─── Данные ──────────────────────────────────────────────────────────────────

const topics = [
    {
        id: 1, title: 'Алгоритмы и их свойства',
        duration: '10 мин', level: 'Базовый', done: true, tag: 'Тема 1',
        content: {
            intro: 'Алгоритм — это конечная последовательность чётко определённых инструкций для решения задачи. Ключевые свойства: дискретность, детерминированность, конечность и результативность.',
            sectionTitle: 'Ключевые свойства алгоритма',
            sectionText: 'Каждый алгоритм должен быть конечным, определённым, иметь входные и выходные данные, и быть эффективным — каждый шаг выполним.',
            code: `# Пример алгоритма поиска максимума
def найти_максимум(список):
    максимум = список[0]
    for элемент in список:
        if элемент > максимум:
            максимум = элемент
    return максимум

числа = [3, 7, 1, 9, 4]
print(найти_максимум(числа))  # 9`,
            tip: 'Попробуй сам: измени список чисел и запусти код в Colab!',
        },
    },
    {
        id: 2, title: 'Типы данных',
        duration: '8 мин', level: 'Базовый', done: true, tag: 'Тема 2',
        content: {
            intro: 'Тип данных определяет множество допустимых значений и операций над ними. В Python основные типы: int, float, str, bool, list, dict.',
            sectionTitle: 'Основные типы данных в Python',
            sectionText: 'Python — язык с динамической типизацией. Тип переменной определяется автоматически при присваивании значения.',
            code: `# Основные типы данных
целое   = 42           # int
дробное = 3.14         # float
строка  = "Привет"     # str
булево  = True         # bool

# Узнать тип
print(type(целое))     # <class 'int'>
print(type(строка))    # <class 'str'>

# Преобразование
число_строкой = str(42)    # "42"
строка_числом = int("100") # 100`,
            tip: 'Запусти функцию type() для каждой переменной — увидишь тип прямо в консоли.',
        },
    },
    {
        id: 3, title: 'Условия и циклы',
        duration: '15 мин', level: 'Базовый', done: true, tag: 'Тема 3',
        content: {
            intro: 'Условные операторы (if/elif/else) и циклы (for/while) — основа управления потоком выполнения программы.',
            sectionTitle: 'Управляющие конструкции',
            sectionText: 'Условные операторы позволяют программе принимать решения, а циклы — повторять действия. Вместе они образуют основу любой нетривиальной программы.',
            code: `# Условия
оценка = 85
if оценка >= 90:
    print("Отлично")
elif оценка >= 70:
    print("Хорошо")
else:
    print("Нужно поработать")

# Цикл for
for i in range(1, 6):
    print(f"Шаг {i}")

# Цикл while
счётчик = 0
while счётчик < 3:
    print(f"Итерация {счётчик}")
    счётчик += 1`,
            tip: 'Попробуй изменить значение оценки и посмотри какой результат выведется.',
        },
    },
    {
        id: 4, title: 'Функции',
        duration: '12 мин', level: 'Средний', done: false, tag: 'Тема 4',
        content: {
            intro: 'Функция — именованный блок кода, который можно вызывать многократно. Главный принцип: DRY — Don\'t Repeat Yourself.',
            sectionTitle: 'Определение и вызов функций',
            sectionText: 'Функции позволяют разбить программу на логические блоки, каждый из которых решает одну конкретную задачу.',
            code: `# Определение функции
def приветствие(имя, возраст=18):
    return f"Привет, {имя}! Тебе {возраст} лет."

# Вызов
print(приветствие("Алия"))
print(приветствие("Данияр", 20))

# Несколько возвращаемых значений
def мин_макс(список):
    return min(список), max(список)

минимум, максимум = мин_макс([3, 1, 7, 2])
print(минимум, максимум)`,
            tip: 'Создай свою функцию — например, для подсчёта суммы всех чётных чисел в списке.',
        },
    },
    {
        id: 5, title: 'Массивы и списки',
        duration: '14 мин', level: 'Средний', done: false, tag: 'Тема 5',
        content: {
            intro: 'Список (list) в Python — упорядоченная изменяемая коллекция элементов. Один из самых используемых типов данных.',
            sectionTitle: 'Работа со списками',
            sectionText: 'Списки поддерживают индексацию, срезы, и множество встроенных методов для удобной работы с данными.',
            code: `# Создание списка
студенты = ["Алия", "Данияр", "Зарина"]

# Доступ по индексу
print(студенты[0])    # Алия
print(студенты[-1])   # Зарина (с конца)

# Методы
студенты.append("Бекзат")
студенты.remove("Данияр")
студенты.sort()

# Перебор
for студент in студенты:
    print(f"Студент: {студент}")`,
            tip: 'Создай список своих любимых предметов и выведи его отсортированным.',
        },
    },
    {
        id: 6, title: 'ООП — основы',
        duration: '20 мин', level: 'Продвинутый', done: false, tag: 'Тема 6',
        content: {
            intro: 'Объектно-ориентированное программирование — парадигма, основанная на концепции объектов содержащих данные и методы.',
            sectionTitle: 'Классы и объекты',
            sectionText: 'Класс — это шаблон для создания объектов. Объект — конкретный экземпляр класса.',
            code: `class Студент:
    def __init__(self, имя, оценка):
        self.имя = имя
        self.оценка = оценка
    
    def статус(self):
        if self.оценка >= 70:
            return f"{self.имя}: сдал ✓"
        return f"{self.имя}: не сдал ✗"

алия = Студент("Алия", 88)
print(алия.статус())`,
            tip: 'Создай объект Студент со своим именем и посмотри что выведет метод статус().',
        },
    },
    {
        id: 7, title: 'Рекурсия',
        duration: '18 мин', level: 'Продвинутый', done: false, tag: 'Тема 7',
        content: {
            intro: 'Рекурсия — это когда функция вызывает сама себя. Каждая рекурсивная функция должна иметь базовый случай.',
            sectionTitle: 'Принцип рекурсии',
            sectionText: 'Важно всегда определять базовый случай — условие остановки. Без него возникнет бесконечная рекурсия.',
            code: `def факториал(n):
    if n == 0 or n == 1:  # базовый случай
        return 1
    return n * факториал(n - 1)  # рекурсия

print(факториал(5))  # 120

# Числа Фибоначчи
def фибоначчи(n):
    if n <= 1:
        return n
    return фибоначчи(n-1) + фибоначчи(n-2)

for i in range(8):
    print(фибоначчи(i), end=" ")`,
            tip: 'Попробуй вычислить факториал числа 10. Что получится?',
        },
    },
    {
        id: 8, title: 'Алгоритмы сортировки',
        duration: '22 мин', level: 'Продвинутый', done: false, tag: 'Тема 8',
        content: {
            intro: 'Сортировка — упорядочивание элементов по заданному критерию. Разные алгоритмы имеют разную сложность.',
            sectionTitle: 'Сортировка пузырьком',
            sectionText: 'Самый простой алгоритм для понимания. Идеален для изучения принципов сортировки.',
            code: `def пузырьковая_сортировка(список):
    n = len(список)
    for i in range(n):
        for j in range(0, n - i - 1):
            if список[j] > список[j + 1]:
                список[j], список[j+1] = список[j+1], список[j]
    return список

числа = [64, 34, 25, 12, 22, 11, 90]
print(пузырьковая_сортировка(числа))
# [11, 12, 22, 25, 34, 64, 90]`,
            tip: 'Визуализацию сортировки можно посмотреть на сайте visualgo.net — очень наглядно!',
        },
    },
]

// ─── Утилиты ──────────────────────────────────────────────────────────────────

function LevelBadge({ level, isDark }) {
    const colors = {
        'Базовый':     { bg: isDark ? '#1A3A2A' : '#E6FFEE', color: isDark ? '#A6E3A1' : '#276749' },
        'Средний':     { bg: isDark ? '#3A2E10' : '#FFFBEB', color: isDark ? '#F9E2AF' : '#975A16' },
        'Продвинутый': { bg: isDark ? '#2E1A3A' : '#FFF5F5', color: isDark ? '#CBA6F7' : '#C53030' },
    }
    const c = colors[level]
    return (
        <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 5, fontWeight: 500,
            background: c.bg, color: c.color,
        }}>
      {level}
    </span>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function StudentTheory() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'

    const [activeTopic, setActiveTopic] = useState(topics[0])
    const [copied, setCopied] = useState(false)

    const completedCount = topics.filter(t => t.done).length
    const currentIndex = topics.findIndex(t => t.id === activeTopic.id)

    function copyCode() {
        navigator.clipboard.writeText(activeTopic.content.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Теория</span>
                </div>
                <ThemeToggle />
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Левая панель — список тем */}
                <div style={{
                    width: 220, minWidth: 220,
                    background: isDark ? '#13141F' : '#fff',
                    borderRight: `1px solid ${t.border}`,
                    display: 'flex', flexDirection: 'column',
                    overflowY: 'auto',
                }}>
                    {/* Прогресс */}
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>Мой прогресс</span>
                            <span style={{ fontSize: 12, color: accent, fontWeight: 500 }}>
                {completedCount}/{topics.length}
              </span>
                        </div>
                        <div style={{ height: 5, borderRadius: 10, background: t.border }}>
                            <div style={{
                                height: 5, borderRadius: 10, background: accent,
                                width: `${(completedCount / topics.length) * 100}%`,
                            }} />
                        </div>
                    </div>

                    {/* Темы */}
                    <div style={{ padding: '8px 0' }}>
                        <div style={{ fontSize: 10, color: t.textSecondary, padding: '2px 16px 6px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Темы курса
                        </div>
                        {topics.map(topic => {
                            const isActive = activeTopic.id === topic.id
                            return (
                                <div
                                    key={topic.id}
                                    onClick={() => setActiveTopic(topic)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 9,
                                        padding: '9px 16px', cursor: 'pointer',
                                        background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                        borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
                                        transition: 'all 0.12s',
                                    }}
                                >
                                    <div style={{
                                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 600,
                                        background: isActive ? accent
                                            : topic.done ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                                : t.border,
                                        color: isActive ? '#fff'
                                            : topic.done ? (isDark ? '#A6E3A1' : '#276749')
                                                : t.textSecondary,
                                    }}>
                                        {topic.done && !isActive ? '✓' : topic.id}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: 12,
                                            color: isActive ? accent : t.text,
                                            fontWeight: isActive ? 500 : 400,
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {topic.title}
                                        </div>
                                        <div style={{ fontSize: 10, color: t.textSecondary }}>{topic.duration}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Правая панель — контент */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: t.bg }}>

                    {/* Заголовок */}
                    <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 5,
                  background: isDark ? '#1E3A5F' : '#EBF4FF',
                  color: accent, fontWeight: 500,
              }}>
                {activeTopic.tag} из {topics.length}
              </span>
                            <LevelBadge level={activeTopic.level} isDark={isDark} />
                            {activeTopic.done && (
                                <span style={{
                                    fontSize: 10, padding: '2px 8px', borderRadius: 5,
                                    background: isDark ? '#1A3A2A' : '#E6FFEE',
                                    color: isDark ? '#A6E3A1' : '#276749', fontWeight: 500,
                                }}>
                  ✅ Изучено
                </span>
                            )}
                        </div>
                        <h1 style={{ fontSize: 20, fontWeight: 600, color: t.text, marginBottom: 8 }}>
                            {activeTopic.title}
                        </h1>
                        <div style={{ display: 'flex', gap: 14 }}>
                            <span style={{ fontSize: 12, color: t.textSecondary }}>📖 {activeTopic.duration}</span>
                            <span style={{ fontSize: 12, color: t.textSecondary }}>🎯 {activeTopic.level}</span>
                        </div>
                    </div>

                    {/* Введение */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 10, padding: 16, marginBottom: 16,
                    }}>
                        <p style={{ fontSize: 13, color: t.text, lineHeight: 1.7, margin: 0 }}>
                            {activeTopic.content.intro}
                        </p>
                    </div>

                    {/* Раздел */}
                    <div style={{ marginBottom: 16 }}>
                        <h2 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 8 }}>
                            {activeTopic.content.sectionTitle}
                        </h2>
                        <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>
                            {activeTopic.content.sectionText}
                        </p>
                    </div>

                    {/* Блок кода */}
                    <div style={{
                        background: isDark ? '#11111B' : '#1A202C',
                        borderRadius: 10, padding: '14px 16px', marginBottom: 16,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4,
                  background: isDark ? '#313244' : '#2D3748', color: '#A6ADC8',
              }}>Python</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={copyCode} style={{
                                    fontSize: 10, padding: '3px 10px', borderRadius: 5, border: 'none',
                                    background: copied ? '#1A3A2A' : (isDark ? '#313244' : '#2D3748'),
                                    color: copied ? '#A6E3A1' : '#A6ADC8',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}>
                                    {copied ? '✓ Скопировано' : 'Копировать'}
                                </button>
                                <button
                                    onClick={() => window.open('https://colab.research.google.com/drive/new', '_blank')}
                                    style={{
                                        fontSize: 10, padding: '3px 10px', borderRadius: 5, border: 'none',
                                        background: '#F9AB00', color: '#fff',
                                        cursor: 'pointer', fontWeight: 600,
                                    }}
                                >
                                    ▶ Colab
                                </button>
                            </div>
                        </div>
                        <pre style={{
                            fontFamily: 'monospace', fontSize: 12,
                            color: '#CDD6F4', margin: 0,
                            overflowX: 'auto', lineHeight: 1.7, whiteSpace: 'pre',
                        }}>
              {activeTopic.content.code}
            </pre>
                    </div>

                    {/* Совет */}
                    <div style={{
                        background: isDark ? '#1E3A5F' : '#EBF4FF',
                        border: `1px solid ${isDark ? '#2A4A7A' : '#BED7FF'}`,
                        borderRadius: 10, padding: 14, marginBottom: 20,
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: accent, marginBottom: 6 }}>
                            💡 Попробуй сам
                        </div>
                        <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>
                            {activeTopic.content.tip}
                        </div>
                    </div>

                    {/* Навигация */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        paddingTop: 16, borderTop: `1px solid ${t.border}`,
                    }}>
                        <button
                            onClick={() => currentIndex > 0 && setActiveTopic(topics[currentIndex - 1])}
                            disabled={currentIndex === 0}
                            style={{
                                padding: '8px 16px', borderRadius: 8, fontSize: 12,
                                border: `1px solid ${t.border}`,
                                background: isDark ? '#313244' : '#fff',
                                color: currentIndex === 0 ? t.textSecondary : t.text,
                                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                opacity: currentIndex === 0 ? 0.5 : 1,
                            }}
                        >
                            ← Назад
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: t.textSecondary }}>
                {currentIndex + 1} / {topics.length}
              </span>
                            <div style={{ width: 80, height: 5, borderRadius: 10, background: t.border }}>
                                <div style={{
                                    height: 5, borderRadius: 10, background: accent,
                                    width: `${((currentIndex + 1) / topics.length) * 100}%`,
                                }} />
                            </div>
                        </div>

                        <button
                            onClick={() => currentIndex < topics.length - 1 && setActiveTopic(topics[currentIndex + 1])}
                            disabled={currentIndex === topics.length - 1}
                            style={{
                                padding: '8px 16px', borderRadius: 8, fontSize: 12,
                                border: 'none',
                                background: currentIndex === topics.length - 1 ? t.border : accent,
                                color: currentIndex === topics.length - 1 ? t.textSecondary : '#fff',
                                fontWeight: 500,
                                cursor: currentIndex === topics.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: currentIndex === topics.length - 1 ? 0.6 : 1,
                            }}
                        >
                            Следующая →
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}