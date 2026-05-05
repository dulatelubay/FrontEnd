// src/pages/Theory.jsx
// Страница теории — Цифровой тренажёр для учителей информатики

import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { themes } from '../styles/themes'
import ThemeToggle from '../components/ThemeToggle'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─── Данные (теперь загружаются из API) ──────────────────────────────────────

const _UNUSED_topics = [
    {
        id: 1,
        title: 'Алгоритмы и их свойства',
        duration: '10 мин',
        level: 'Базовый',
        done: true,
        tag: 'Тема 1',
        content: {
            intro: 'Алгоритм — это конечная последовательность чётко определённых инструкций для решения задачи. Ключевые свойства: дискретность, детерминированность, конечность и результативность.',
            sectionTitle: 'Ключевые свойства алгоритма',
            sectionText: 'Каждый алгоритм должен обладать следующими свойствами: он должен быть конечным (завершаться за конечное число шагов), определённым (каждый шаг точно определён), иметь входные и выходные данные, и быть эффективным (каждый шаг выполним).',
            code: `# Пример простого алгоритма поиска максимума
def найти_максимум(список):
    максимум = список[0]
    for элемент in список:
        if элемент > максимум:
            максимум = элемент
    return максимум

# Использование
числа = [3, 7, 1, 9, 4]
print(найти_максимум(числа))  # 9`,
            tip: 'Начните урок с бытового примера: рецепт блюда — это тоже алгоритм. Ученики сразу понимают концепцию.',
            warning: 'Ученики путают алгоритм с программой. Подчеркните: алгоритм не зависит от языка программирования — он про логику.',
        }
    },
    {
        id: 2,
        title: 'Типы данных',
        duration: '8 мин',
        level: 'Базовый',
        done: true,
        tag: 'Тема 2',
        content: {
            intro: 'Тип данных определяет множество допустимых значений и операций над ними. В Python основные типы: int, float, str, bool, list, dict.',
            sectionTitle: 'Основные типы данных в Python',
            sectionText: 'Python является языком с динамической типизацией — тип переменной определяется автоматически при присваивании значения. Это удобно для начинающих, но требует понимания преобразований типов.',
            code: `# Основные типы данных Python
целое = 42           # int
дробное = 3.14       # float
строка = "Привет"    # str
булево = True        # bool

# Преобразование типов
число_строкой = str(целое)    # "42"
строка_числом = int("100")    # 100

print(type(целое))   # <class 'int'>`,
            tip: 'Используйте функцию type() для демонстрации — ученики видят тип прямо в консоли. Это наглядно.',
            warning: 'Частая ошибка: сложение числа и строки. Например, "5" + 5 вызовет TypeError. Покажите это явно.',
        }
    },
    {
        id: 3,
        title: 'Условия и циклы',
        duration: '15 мин',
        level: 'Базовый',
        done: true,
        tag: 'Тема 3',
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
            tip: 'Начните с блок-схемы на доске. Визуализация if/else через блок-схему резко снижает количество ошибок у учеников.',
            warning: 'Бесконечный цикл while — классическая ошибка. Всегда показывайте пример с забытым инкрементом счётчика.',
        }
    },
    {
        id: 4,
        title: 'Функции',
        duration: '12 мин',
        level: 'Средний',
        done: false,
        tag: 'Тема 4',
        content: {
            intro: 'Функция — именованный блок кода, который можно вызывать многократно. Принципы: DRY (Don\'t Repeat Yourself) и единственная ответственность.',
            sectionTitle: 'Определение и вызов функций',
            sectionText: 'Функции позволяют разбить программу на логические блоки, каждый из которых решает одну конкретную задачу. Это упрощает чтение, тестирование и отладку кода.',
            code: `# Определение функции
def приветствие(имя, возраст=18):
    """Функция приветствия с параметрами"""
    return f"Привет, {имя}! Тебе {возраст} лет."

# Вызов
print(приветствие("Алия"))         # возраст по умолчанию
print(приветствие("Данияр", 20))   # свой возраст

# Функция с несколькими возвращаемыми значениями
def мин_макс(список):
    return min(список), max(список)

минимум, максимум = мин_макс([3, 1, 7, 2])`,
            tip: 'Объясняйте функции через аналогию с кнопкой: нажал (вызвал) — получил результат. Параметры — это настройки кнопки.',
            warning: 'Ученики часто путают return и print. Покажите разницу: print выводит на экран, return передаёт значение обратно.',
        }
    },
    {
        id: 5,
        title: 'Массивы и списки',
        duration: '14 мин',
        level: 'Средний',
        done: false,
        tag: 'Тема 5',
        content: {
            intro: 'Список (list) в Python — упорядоченная изменяемая коллекция элементов. Один из самых используемых типов данных.',
            sectionTitle: 'Работа со списками',
            sectionText: 'Списки позволяют хранить несколько значений в одной переменной. Они поддерживают индексацию, срезы, и множество встроенных методов для удобной работы с данными.',
            code: `# Создание и операции со списком
студенты = ["Алия", "Данияр", "Зарина"]

# Доступ по индексу
print(студенты[0])    # Алия
print(студенты[-1])   # Зарина (с конца)

# Методы списка
студенты.append("Бекзат")   # добавить
студенты.remove("Данияр")   # удалить
студенты.sort()              # сортировать

# Срезы
первые_двое = студенты[0:2]

# Перебор
for студент in студенты:
    print(f"Студент: {студент}")`,
            tip: 'Визуализируйте список как шкафчики с номерами. Индекс — это номер шкафчика. Нумерация с нуля — важный момент.',
            warning: 'IndexError при обращении к несуществующему индексу — частая ошибка. Отработайте её специально на занятии.',
        }
    },
    {
        id: 6,
        title: 'ООП — основы',
        duration: '20 мин',
        level: 'Продвинутый',
        done: false,
        tag: 'Тема 6',
        content: {
            intro: 'Объектно-ориентированное программирование — парадигма, основанная на концепции объектов, содержащих данные и методы.',
            sectionTitle: 'Классы и объекты',
            sectionText: 'Класс — это шаблон для создания объектов. Объект — конкретный экземпляр класса. Три столпа ООП: инкапсуляция, наследование, полиморфизм.',
            code: `# Определение класса
class Студент:
    def __init__(self, имя, оценка):
        self.имя = имя
        self.оценка = оценка
    
    def статус(self):
        if self.оценка >= 70:
            return f"{self.имя}: сдал ✓"
        return f"{self.имя}: не сдал ✗"
    
    def __str__(self):
        return f"Студент({self.имя}, {self.оценка})"

# Создание объектов
алия = Студент("Алия", 88)
данияр = Студент("Данияр", 65)

print(алия.статус())    # Алия: сдал ✓
print(данияр.статус())  # Данияр: сдал ✓`,
            tip: 'Объясняйте класс через форму для печенья: форма — это класс, каждое печенье — объект. Все печенья одинаковой формы, но могут отличаться начинкой.',
            warning: 'self — самая частая точка непонимания. Потратьте отдельное время чтобы объяснить зачем он нужен.',
        }
    },
    {
        id: 7,
        title: 'Рекурсия',
        duration: '18 мин',
        level: 'Продвинутый',
        done: false,
        tag: 'Тема 7',
        content: {
            intro: 'Рекурсия — это когда функция вызывает сама себя. Каждая рекурсивная функция должна иметь базовый случай (условие остановки).',
            sectionTitle: 'Принцип рекурсии',
            sectionText: 'Рекурсивные решения часто элегантнее итеративных, но требуют больше памяти из-за стека вызовов. Важно всегда определять базовый случай, иначе возникнет бесконечная рекурсия.',
            code: `# Классический пример: факториал
def факториал(n):
    # Базовый случай
    if n == 0 or n == 1:
        return 1
    # Рекурсивный вызов
    return n * факториал(n - 1)

print(факториал(5))  # 120
# 5 * 4 * 3 * 2 * 1 = 120

# Числа Фибоначчи
def фибоначчи(n):
    if n <= 1:
        return n
    return фибоначчи(n-1) + фибоначчи(n-2)

for i in range(8):
    print(фибоначчи(i), end=" ")  # 0 1 1 2 3 5 8 13`,
            tip: 'Нарисуйте дерево вызовов на доске для факториала(4). Визуализация стека вызовов — лучший способ объяснить рекурсию.',
            warning: 'Без базового случая — бесконечная рекурсия и RecursionError. Всегда начинайте объяснение с условия остановки.',
        }
    },
    {
        id: 8,
        title: 'Алгоритмы сортировки',
        duration: '22 мин',
        level: 'Продвинутый',
        done: false,
        tag: 'Тема 8',
        content: {
            intro: 'Сортировка — упорядочивание элементов по заданному критерию. Разные алгоритмы имеют разную сложность: от O(n²) до O(n log n).',
            sectionTitle: 'Сортировка пузырьком',
            sectionText: 'Сортировка пузырьком — простейший алгоритм для понимания. Несмотря на низкую эффективность O(n²), она идеальна для обучения принципам сортировки.',
            code: `# Сортировка пузырьком
def пузырьковая_сортировка(список):
    n = len(список)
    for i in range(n):
        for j in range(0, n - i - 1):
            if список[j] > список[j + 1]:
                # Меняем местами
                список[j], список[j+1] = список[j+1], список[j]
    return список

числа = [64, 34, 25, 12, 22, 11, 90]
print(пузырьковая_сортировка(числа))
# [11, 12, 22, 25, 34, 64, 90]

# Встроенная сортировка Python (быстрее)
числа.sort()           # изменяет список
sorted_list = sorted(числа)  # создаёт новый`,
            tip: 'Есть отличная визуализация на сайте visualgo.net — покажите её в классе. Ученики видят каждый шаг алгоритма в реальном времени.',
            warning: 'Не нужно заставлять учеников писать сортировку пузырьком для реальных задач — объясните что есть sort() и sorted(). Цель — понять принцип.',
        }
    },
]

// ─── Вспомогательные компоненты ──────────────────────────────────────────────

function LevelBadge({ level, t, isDark }) {
    const colors = {
        'Базовый':      { bg: isDark ? '#1A3A2A' : '#E6FFEE', color: isDark ? '#A6E3A1' : '#276749' },
        'Средний':      { bg: isDark ? '#3A2E10' : '#FFFBEB', color: isDark ? '#F9E2AF' : '#975A16' },
        'Продвинутый':  { bg: isDark ? '#2E1A3A' : '#FFF5F5', color: isDark ? '#CBA6F7' : '#C53030' },
    }
    const c = colors[level] || colors['Базовый']
    return (
        <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 5,
            background: c.bg, color: c.color, fontWeight: 500,
        }}>
      {level}
    </span>
    )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function Theory() {
    const { theme } = useTheme()
    const t = themes[theme]
    const isDark = theme === 'dark'
    const accent = isDark ? '#89B4FA' : '#1A6EFF'
    const { authFetch } = useAuth()

    const [topics, setTopics]         = useState([])
    const [activeTopic, setActiveTopic] = useState(null)
    const [copied, setCopied]         = useState(false)
    const [doneTopics, setDoneTopics] = useState(new Set())

    useEffect(() => {
        authFetch('/api/topics')
            .then(r => r.json())
            .then(data => {
                setTopics(data)
                if (data.length > 0) setActiveTopic(data[0])
            })
            .catch(() => {})
    }, [])

    const completedCount = topics.filter(topic => doneTopics.has(topic.id)).length

    function toggleDone() {
        if (!activeTopic) return
        setDoneTopics(prev => {
            const next = new Set(prev)
            next.has(activeTopic.id) ? next.delete(activeTopic.id) : next.add(activeTopic.id)
            return next
        })
    }

    function copyCode() {
        if (!activeTopic) return
        navigator.clipboard.writeText(activeTopic.content.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const currentIndex = activeTopic ? topics.findIndex(topic => topic.id === activeTopic.id) : -1

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
                    <Link to="/" style={{ fontSize: 12, color: t.textSecondary, textDecoration: 'none' }}>
                        Главная
                    </Link>
                    <span style={{ color: t.textSecondary, fontSize: 12 }}>/</span>
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Теория</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ThemeToggle />
                    <button style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12,
                        background: accent, color: '#fff', border: 'none',
                        fontWeight: 500, cursor: 'pointer',
                    }}>
                        + Добавить тему
                    </button>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* ── Левая панель: список тем ── */}
                <div style={{
                    width: 220,
                    minWidth: 220,
                    background: isDark ? '#13141F' : '#fff',
                    borderRight: `1px solid ${t.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                }}>
                    {/* Прогресс */}
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>Прогресс</span>
                            <span style={{ fontSize: 12, color: accent, fontWeight: 500 }}>
                {completedCount}/{topics.length || '…'}
              </span>
                        </div>
                        <div style={{ height: 5, borderRadius: 10, background: t.border }}>
                            <div style={{
                                height: 5, borderRadius: 10, background: accent,
                                width: topics.length > 0 ? `${(completedCount / topics.length) * 100}%` : '0%',
                                transition: 'width 0.4s ease',
                            }} />
                        </div>
                    </div>

                    {/* Список тем */}
                    <div style={{ padding: '8px 0' }}>
                        <div style={{
                            fontSize: 10, color: t.textSecondary,
                            padding: '2px 16px 6px',
                            textTransform: 'uppercase', letterSpacing: '0.07em',
                        }}>
                            Темы курса
                        </div>
                        {topics.map((topic) => {
                            const isActive = activeTopic.id === topic.id
                            return (
                                <div
                                    key={topic.id}
                                    onClick={() => setActiveTopic(topic)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 9,
                                        padding: '9px 16px',
                                        cursor: 'pointer',
                                        background: isActive ? (isDark ? '#1E3A5F' : '#EBF4FF') : 'transparent',
                                        borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
                                        transition: 'all 0.12s',
                                    }}
                                >
                                    <div style={{
                                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 600,
                                        background: isActive
                                            ? accent
                                            : (doneTopics.has(topic.id)
                                                ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                                : t.border),
                                        color: isActive
                                            ? '#fff'
                                            : (doneTopics.has(topic.id)
                                                ? (isDark ? '#A6E3A1' : '#276749')
                                                : t.textSecondary),
                                    }}>
                                        {doneTopics.has(topic.id) && !isActive ? '✓' : topic.id}
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

                {/* ── Правая панель: контент темы ── */}
                <div style={{
                    flex: 1, overflowY: 'auto',
                    padding: '22px 26px',
                    background: t.bg,
                }}>
                {!activeTopic ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60%', color: t.textSecondary, fontSize: 13 }}>
                        Загрузка…
                    </div>
                ) : (<>

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
                            <LevelBadge level={activeTopic.level} t={t} isDark={isDark} />
                            <button
                                onClick={toggleDone}
                                style={{
                                    fontSize: 10, padding: '2px 10px', borderRadius: 5, border: 'none',
                                    cursor: 'pointer', fontWeight: 500,
                                    background: doneTopics.has(activeTopic.id)
                                        ? (isDark ? '#1A3A2A' : '#E6FFEE')
                                        : (isDark ? '#2A2B3D' : '#F0F0F5'),
                                    color: doneTopics.has(activeTopic.id)
                                        ? (isDark ? '#A6E3A1' : '#276749')
                                        : t.textSecondary,
                                }}
                            >
                                {doneTopics.has(activeTopic.id) ? '✅ Пройдено' : '○ Отметить пройденным'}
                            </button>
                        </div>
                        <h1 style={{ fontSize: 20, fontWeight: 600, color: t.text, marginBottom: 8 }}>
                            {activeTopic.title}
                        </h1>
                        <div style={{ display: 'flex', gap: 14 }}>
                            <span style={{ fontSize: 12, color: t.textSecondary }}>📖 {activeTopic.duration} чтения</span>
                            <span style={{ fontSize: 12, color: t.textSecondary }}>🎯 {activeTopic.level} уровень</span>
                        </div>
                    </div>

                    {/* Введение */}
                    <div style={{
                        background: isDark ? '#181926' : '#fff',
                        border: `1px solid ${t.border}`,
                        borderRadius: 10, padding: 16, marginBottom: 16,
                    }}>
                        <p style={{ fontSize: 13, color: t.text, lineHeight: 1.7 }}>
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
                        borderRadius: 10, padding: '14px 16px',
                        marginBottom: 16, position: 'relative',
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 10,
                        }}>
              <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4,
                  background: isDark ? '#313244' : '#2D3748',
                  color: '#A6ADC8',
              }}>Python</span>
                            <button
                                onClick={copyCode}
                                style={{
                                    fontSize: 10, padding: '3px 10px', borderRadius: 5,
                                    background: copied ? '#1A3A2A' : (isDark ? '#313244' : '#2D3748'),
                                    color: copied ? '#A6E3A1' : '#A6ADC8',
                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                }}
                            >
                                {copied ? '✓ Скопировано' : 'Копировать'}
                            </button>
                        </div>
                        <pre style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: 12, lineHeight: 1.7,
                            color: '#CDD6F4', margin: 0,
                            overflowX: 'auto', whiteSpace: 'pre',
                        }}>
              {activeTopic.content.code
                  .replace(/\b(def|return|if|elif|else|for|in|while|class|print|True|False|None|and|or|not)\b/g, (m) => `\x01${m}\x01`)
                  .split('\x01')
                  .map((part, i) => {
                      const kws = ['def','return','if','elif','else','for','in','while','class','print','True','False','None','and','or','not']
                      if (kws.includes(part)) {
                          return <span key={i} style={{ color: '#89B4FA' }}>{part}</span>
                      }
                      return <span key={i}>{part}</span>
                  })
              }
            </pre>
                    </div>

                    {/* Советы */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                        <div style={{
                            background: isDark ? '#1E3A5F' : '#EBF4FF',
                            border: `1px solid ${isDark ? '#2A4A7A' : '#BED7FF'}`,
                            borderRadius: 10, padding: 14,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                                🔑 Методический совет
                            </div>
                            <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>
                                {activeTopic.content.tip}
                            </div>
                        </div>
                        <div style={{
                            background: isDark ? '#3A2E10' : '#FFFBEB',
                            border: `1px solid ${isDark ? '#5A4A18' : '#FAD87E'}`,
                            borderRadius: 10, padding: 14,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                                ⚠️ Частая ошибка
                            </div>
                            <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>
                                {activeTopic.content.warning}
                            </div>
                        </div>
                    </div>

                    {/* Навигация между темами */}
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
                            ← Предыдущая
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: t.textSecondary }}>
                {currentIndex >= 0 ? currentIndex + 1 : '—'} / {topics.length}
              </span>
                            <div style={{ width: 80, height: 5, borderRadius: 10, background: t.border }}>
                                <div style={{
                                    height: 5, borderRadius: 10, background: accent,
                                    width: topics.length > 0 ? `${((currentIndex + 1) / topics.length) * 100}%` : '0%',
                                    transition: 'width 0.3s',
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
                            Следующая тема →
                        </button>
                    </div>
                </>)}

                </div>
            </div>
        </div>
    )
}