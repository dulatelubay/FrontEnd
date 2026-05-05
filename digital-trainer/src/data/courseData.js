// src/data/courseData.js
// Seed data for the course learning flow

export const COURSES = [
    {
        id: 'course-1',
        title: 'Введение в анализ данных для учителей информатики',
        description:
            'Практический курс для учителей информатики: от работы с таблицами в pandas до выявления учеников в зоне риска с помощью Python.',
        modules: [
            // ─────────────────────────────────────────────────────────
            // Module 1
            // ─────────────────────────────────────────────────────────
            {
                id: 'module-1',
                title: 'Работа с табличными данными в Python',
                lecture: {
                    blocks: [
                        { type: 'heading',   text: 'Зачем учителю анализ данных?' },
                        {
                            type: 'paragraph',
                            text: 'Современный учитель принимает решения каждый день: кому дать дополнительное задание, кого вызвать к доске, как скорректировать план урока. Анализ данных позволяет делать эти решения обоснованными — опираясь не на интуицию, а на цифры и закономерности в успеваемости, посещаемости и активности учеников.',
                        },
                        { type: 'heading',   text: 'Экосистема Python для анализа данных' },
                        {
                            type: 'list',
                            items: [
                                'pandas — работа с таблицами',
                                'numpy — числовые вычисления',
                                'matplotlib — визуализация',
                                'seaborn — статистические графики',
                            ],
                        },
                        { type: 'heading',   text: 'Что такое DataFrame?' },
                        {
                            type: 'paragraph',
                            text: 'DataFrame — это двумерная таблица с подписанными строками и столбцами. Думайте о нём как об Excel-таблице, только управляемой кодом: вы можете фильтровать строки, вычислять агрегаты, строить графики — всё программно, воспроизводимо и масштабируемо.',
                        },
                        {
                            type: 'callout',
                            variant: 'tip',
                            text: 'DataFrame можно создать из CSV, Excel, словаря Python или базы данных',
                        },
                        { type: 'heading',   text: 'Основные операции' },
                        {
                            type: 'code',
                            language: 'python',
                            text: `import pandas as pd

# Чтение данных
df = pd.read_csv('students.csv')

# Первые 5 строк
print(df.head())

# Статистика
print(df.describe())

# Фильтрация: ученики с оценкой ниже 60
weak = df[df['grade'] < 60]

# Среднее по столбцу
avg = df['grade'].mean()`,
                        },
                        {
                            type: 'callout',
                            variant: 'info',
                            text: "df.describe() возвращает count, mean, std, min, 25%, 50%, 75%, max для числовых столбцов",
                        },
                    ],
                },
                quiz: {
                    passingScore: 60,
                    questions: [
                        {
                            id: 'q1-1',
                            text: 'Что такое DataFrame в pandas?',
                            options: [
                                'Одномерный массив',
                                'Двумерная таблица с метками строк и столбцов',
                                'Функция для чтения CSV',
                                'Словарь Python',
                            ],
                            correct: [1],
                            explanation: 'DataFrame — двумерная структура данных, похожая на таблицу Excel, с метками строк и столбцов.',
                        },
                        {
                            id: 'q1-2',
                            text: 'Как прочитать CSV-файл с помощью pandas?',
                            options: [
                                'pd.load_csv()',
                                'pd.open()',
                                'pd.read_csv()',
                                'pd.import()',
                            ],
                            correct: [2],
                            explanation: 'pd.read_csv() — стандартный способ загрузки CSV в DataFrame.',
                        },
                        {
                            id: 'q1-3',
                            text: 'Что возвращает df.describe()?',
                            options: [
                                'Первые 5 строк',
                                'Статистическую сводку (mean, std, min, max и т.д.)',
                                'Список столбцов',
                                'Типы данных столбцов',
                            ],
                            correct: [1],
                            explanation: 'describe() вычисляет основные статистики для числовых столбцов.',
                        },
                        {
                            id: 'q1-4',
                            text: "Как отфильтровать строки, где столбец grade меньше 60?",
                            options: [
                                'df.filter(grade < 60)',
                                'df.where(grade < 60)',
                                "df[df['grade'] < 60]",
                                'df.select(grade < 60)',
                            ],
                            correct: [2],
                            explanation: "Булева индексация df[условие] — стандартный способ фильтрации в pandas.",
                        },
                    ],
                },
                practical: {
                    title: 'Анализ успеваемости класса 9Б',
                    context:
                        'Вы учитель информатики в школе №42 города Алматы. Завуч попросил вас подготовить аналитику по успеваемости класса 9Б за прошедший семестр. В вашем распоряжении — данные об оценках по трём предметам и посещаемости каждого ученика.',
                    problemStatement:
                        'Загрузите данные, вычислите среднюю оценку по каждому предмету, найдите учеников со средним баллом ниже 65 и выведите итоговую сводку.',
                    inputDescription:
                        'Таблица с колонками: имя (str), математика (int), физика (int), информатика (int), посещаемость (float, доля от 0 до 1)',
                    expectedOutput:
                        'Вывод статистики по предметам и список учеников с низкой успеваемостью (средний балл < 65)',
                    starterCode: `import pandas as pd
import io

# Данные класса 9Б (симулированные)
csv_data = """имя,математика,физика,информатика,посещаемость
Алия Нурланова,85,78,92,0.95
Дамир Сейтов,62,55,70,0.82
Карина Петрова,90,88,95,0.98
Тимур Ахметов,45,50,58,0.70
Айгерим Байкенова,78,72,85,0.90
Нуржан Касымов,32,38,55,0.58
Медина Серикова,88,85,90,0.95
Саят Оспанов,65,68,72,0.85
Лаура Дюсенова,92,90,96,0.98
Максим Волков,55,48,63,0.72"""

df = pd.read_csv(io.StringIO(csv_data))

# TODO: вычислите среднюю оценку по каждому предмету
# TODO: найдите учеников со средним баллом ниже 65
# TODO: выведите итоговую сводку

print("=== Данные класса 9Б ===")
print(df.to_string(index=False))`,
                },
            },

            // ─────────────────────────────────────────────────────────
            // Module 2
            // ─────────────────────────────────────────────────────────
            {
                id: 'module-2',
                title: 'Визуализация образовательных данных',
                lecture: {
                    blocks: [
                        { type: 'heading',   text: 'Зачем визуализировать данные?' },
                        {
                            type: 'paragraph',
                            text: 'График сообщает за секунды то, на разбор чего в таблице уйдут минуты. Для учителя диаграммы делают закономерности в успеваемости учеников мгновенно видимыми: сразу понятно, где просадка, а где рост.',
                        },
                        { type: 'heading',   text: 'Типы графиков и когда их применять' },
                        {
                            type: 'list',
                            items: [
                                'Гистограмма (histogram) — распределение значений (напр. оценки)',
                                'Столбчатый (bar chart) — сравнение категорий (напр. средний балл по теме)',
                                'Линейный (line chart) — динамика во времени',
                                'Точечный (scatter) — корреляция между двумя переменными',
                                'Ящик с усами (boxplot) — разброс и выбросы',
                            ],
                        },
                        { type: 'heading',   text: 'Matplotlib — основы' },
                        {
                            type: 'code',
                            language: 'python',
                            text: `import matplotlib.pyplot as plt
import pandas as pd

grades = [85, 62, 90, 45, 78, 32, 88, 65, 92, 55]

# Гистограмма
plt.figure(figsize=(8, 4))
plt.hist(grades, bins=5, color='steelblue', edgecolor='white')
plt.title('Распределение оценок')
plt.xlabel('Оценка')
plt.ylabel('Количество учеников')
plt.tight_layout()
plt.show()`,
                        },
                        {
                            type: 'callout',
                            variant: 'tip',
                            text: 'plt.tight_layout() автоматически подгоняет отступы — используйте его всегда перед plt.show()',
                        },
                        { type: 'heading',   text: 'Seaborn — статистические графики' },
                        {
                            type: 'code',
                            language: 'python',
                            text: `import seaborn as sns

# Красивый boxplot одной строкой
sns.boxplot(data=df[['математика', 'физика', 'информатика']])
plt.title('Разброс оценок по предметам')
plt.show()`,
                        },
                        {
                            type: 'callout',
                            variant: 'info',
                            text: 'Seaborn работает поверх matplotlib и строит красивые статистические графики с минимумом кода',
                        },
                    ],
                },
                quiz: {
                    passingScore: 60,
                    questions: [
                        {
                            id: 'q2-1',
                            text: 'Какой тип графика лучше всего подходит для показа распределения оценок?',
                            options: ['Линейный', 'Столбчатый', 'Гистограмма', 'Круговой'],
                            correct: [2],
                            explanation: 'Гистограмма показывает, как часто встречаются значения в разных диапазонах.',
                        },
                        {
                            id: 'q2-2',
                            text: 'Какая библиотека построена поверх matplotlib для статистической визуализации?',
                            options: ['Plotly', 'Bokeh', 'Seaborn', 'Altair'],
                            correct: [2],
                            explanation: 'Seaborn расширяет matplotlib и специализируется на статистических графиках.',
                        },
                        {
                            id: 'q2-3',
                            text: 'Что делает plt.figure(figsize=(10, 6))?',
                            options: [
                                'Сохраняет рисунок размером 10×6 пикселей',
                                'Создаёт рисунок шириной 10 и высотой 6 дюймов',
                                'Задаёт разрешение 10×6 DPI',
                                'Устанавливает 10 столбцов и 6 строк',
                            ],
                            correct: [1],
                            explanation: 'figsize задаётся в дюймах. (10, 6) — стандартный широкоформатный размер.',
                        },
                        {
                            id: 'q2-4',
                            text: 'Какой метод DataFrame создаёт быстрый график?',
                            options: ['pd.plot()', 'df.chart()', 'df.plot()', 'plt.dataframe()'],
                            correct: [2],
                            explanation: 'df.plot() — встроенный метод pandas, использует matplotlib под капотом.',
                        },
                    ],
                },
                practical: {
                    title: 'Визуализация результатов класса',
                    context:
                        'Продолжаем работу с данными класса 9Б. Завуч хочет увидеть не только числа, но и наглядные графики: как распределены оценки и по каким предметам класс справляется лучше или хуже.',
                    problemStatement:
                        'Постройте два графика: 1) гистограмму распределения среднего балла по ученикам; 2) столбчатый график средних оценок по каждому предмету.',
                    inputDescription: 'Те же данные класса 9Б из модуля 1',
                    expectedOutput: 'Два matplotlib-графика: гистограмма и bar chart',
                    starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

csv_data = """имя,математика,физика,информатика,посещаемость
Алия Нурланова,85,78,92,0.95
Дамир Сейтов,62,55,70,0.82
Карина Петрова,90,88,95,0.98
Тимур Ахметов,45,50,58,0.70
Айгерим Байкенова,78,72,85,0.90
Нуржан Касымов,32,38,55,0.58
Медина Серикова,88,85,90,0.95
Саят Оспанов,65,68,72,0.85
Лаура Дюсенова,92,90,96,0.98
Максим Волков,55,48,63,0.72"""

df = pd.read_csv(io.StringIO(csv_data))
df['средний_балл'] = df[['математика', 'физика', 'информатика']].mean(axis=1).round(1)

# TODO: постройте гистограмму распределения среднего балла

# TODO: постройте столбчатый график средних оценок по предметам

plt.show()`,
                },
            },

            // ─────────────────────────────────────────────────────────
            // Module 3
            // ─────────────────────────────────────────────────────────
            {
                id: 'module-3',
                title: 'Выявление учеников в зоне риска',
                lecture: {
                    blocks: [
                        { type: 'heading',   text: 'Что такое анализ образовательных данных?' },
                        {
                            type: 'paragraph',
                            text: 'Educational data mining помогает выявлять закономерности — например, какие ученики рискуют отстать — прежде чем станет слишком поздно вмешаться. Это не замена живому контакту с учеником, а инструмент ранней диагностики.',
                        },
                        { type: 'heading',   text: 'Ключевые показатели риска' },
                        {
                            type: 'list',
                            items: [
                                'Низкая посещаемость (< 70%)',
                                'Падение среднего балла ниже 60',
                                'Мало сданных заданий',
                                'Снижение активности на уроках',
                            ],
                        },
                        { type: 'heading',   text: 'Корреляционный анализ' },
                        {
                            type: 'paragraph',
                            text: 'Корреляция показывает, насколько сильно две переменные меняются вместе. В образовании: предсказывает ли посещаемость оценки? Связана ли вовлечённость с успеваемостью? Это ключевой инструмент для понимания факторов риска.',
                        },
                        {
                            type: 'code',
                            language: 'python',
                            text: `import pandas as pd

# Матрица корреляций
corr = df.corr(numeric_only=True)
print(corr.round(2))

# Корреляция посещаемости с оценками
print(df['посещаемость'].corr(df['средний_балл']))`,
                        },
                        {
                            type: 'callout',
                            variant: 'tip',
                            text: 'Коэффициент корреляции: 0.7–1.0 — сильная, 0.4–0.7 — умеренная, < 0.4 — слабая. Отрицательные значения означают обратную связь.',
                        },
                        { type: 'heading',   text: 'Фильтрация учеников в зоне риска' },
                        {
                            type: 'code',
                            language: 'python',
                            text: `# Ученики с посещаемостью < 75% И средним баллом < 65
at_risk = df[(df['посещаемость'] < 0.75) & (df['средний_балл'] < 65)]
print(f"В зоне риска: {len(at_risk)} учеников")
print(at_risk[['имя', 'средний_балл', 'посещаемость']])`,
                        },
                        {
                            type: 'callout',
                            variant: 'warning',
                            text: 'Данные — это инструмент поддержки решения, а не приговор. Всегда сочетайте аналитику с личным контактом с учеником.',
                        },
                    ],
                },
                quiz: {
                    passingScore: 60,
                    questions: [
                        {
                            id: 'q3-1',
                            text: 'Какое значение коэффициента корреляции указывает на сильную положительную связь?',
                            options: ['0.1 – 0.3', '0.3 – 0.5', '0.5 – 0.7', '0.7 – 1.0'],
                            correct: [3],
                            explanation: 'Значения 0.7–1.0 считаются сильной корреляцией в большинстве педагогических исследований.',
                        },
                        {
                            id: 'q3-2',
                            text: 'Какой метод pandas вычисляет матрицу корреляций?',
                            options: ['df.correlation()', 'df.corr()', 'df.pearson()', 'df.cov()'],
                            correct: [1],
                            explanation: 'df.corr() вычисляет попарные коэффициенты корреляции Пирсона для числовых столбцов.',
                        },
                        {
                            id: 'q3-3',
                            text: "Как отфильтровать учеников, у которых И посещаемость < 0.75, И оценка < 60?",
                            options: [
                                "df[df['att'] < 0.75 or df['gr'] < 60]",
                                "df[df['att'] < 0.75 & df['gr'] < 60]",
                                "df[(df['att'] < 0.75) & (df['gr'] < 60)]",
                                "df.filter(att < 0.75, gr < 60)",
                            ],
                            correct: [2],
                            explanation: 'При объединении условий каждое нужно взять в скобки, а оператор — &.',
                        },
                        {
                            id: 'q3-4',
                            text: "Что делает df.groupby('предмет').mean()?",
                            options: [
                                'Выбирает столбец предмет',
                                'Сортирует по предмету',
                                'Группирует строки по предмету и вычисляет среднее для каждой группы',
                                'Удаляет дубликаты по предмету',
                            ],
                            correct: [2],
                            explanation: 'groupby().mean() — стандартный способ получить агрегат по группам в pandas.',
                        },
                    ],
                },
                practical: {
                    title: 'Комплексный анализ: выявление учеников в зоне риска',
                    context:
                        'Вы участвуете в педагогическом совете. Классные руководители 9-х классов попросили вас провести анализ данных и назвать учеников, которым нужна дополнительная поддержка. В вашем распоряжении — расширенный набор данных с несколькими метриками.',
                    problemStatement:
                        'Определите учеников "в зоне риска" (посещаемость < 75% ИЛИ средний балл < 60). Вычислите корреляцию между посещаемостью и успеваемостью. Визуализируйте результаты: scatter-plot посещаемость vs средний балл, выделив учеников в зоне риска другим цветом.',
                    inputDescription:
                        'Расширенный датасет: имя, математика, физика, информатика, посещаемость, сдано_заданий (из 20)',
                    expectedOutput:
                        'Список учеников в зоне риска + корреляция + scatter plot с выделением',
                    starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

csv_data = """имя,математика,физика,информатика,посещаемость,сдано_заданий
Алия Нурланова,85,78,92,0.95,19
Дамир Сейтов,62,55,70,0.82,14
Карина Петрова,90,88,95,0.98,20
Тимур Ахметов,45,50,58,0.68,9
Айгерим Байкенова,78,72,85,0.90,17
Нуржан Касымов,32,38,55,0.55,7
Медина Серикова,88,85,90,0.95,19
Саят Оспанов,65,68,72,0.85,15
Лаура Дюсенова,92,90,96,0.98,20
Максим Волков,55,48,63,0.72,11
Арман Жаксыбеков,40,42,50,0.60,8
Динара Сагынтаева,75,70,80,0.88,16"""

df = pd.read_csv(io.StringIO(csv_data))
df['средний_балл'] = df[['математика', 'физика', 'информатика']].mean(axis=1).round(1)

# TODO: найдите учеников в зоне риска (посещаемость < 0.75 ИЛИ средний_балл < 60)

# TODO: вычислите корреляцию между посещаемостью и средним баллом

# TODO: постройте scatter plot (посещаемость vs средний_балл),
# выделите учеников в зоне риска красным цветом

plt.show()`,
                },
            },
        ],
    },
]

// ─── Progress helpers ────────────────────────────────────────────────────────

/**
 * Read the full progress object from localStorage for a given user.
 * Shape: { [courseId]: { [moduleId]: { lectureRead, quizPassed, quizScore, practicalDone } } }
 */
export function readProgress(userId) {
    try {
        const raw = localStorage.getItem(`course_progress_${userId}`)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

/**
 * Write the full progress object back to localStorage.
 */
export function writeProgress(userId, progress) {
    localStorage.setItem(`course_progress_${userId}`, JSON.stringify(progress))
}

/**
 * Get progress for a specific module (returns defaults if not set).
 */
export function getModuleProgress(progress, courseId, moduleId) {
    return progress?.[courseId]?.[moduleId] ?? {
        lectureRead: false,
        quizPassed: false,
        quizScore: 0,
        practicalDone: false,
    }
}

/**
 * Patch a single module's progress and persist.
 */
export function patchModuleProgress(userId, courseId, moduleId, patch) {
    const progress = readProgress(userId)
    if (!progress[courseId]) progress[courseId] = {}
    progress[courseId][moduleId] = {
        ...getModuleProgress(progress, courseId, moduleId),
        ...patch,
    }
    writeProgress(userId, progress)
    return progress
}

/**
 * Determine whether a module is locked for a given course.
 * Module 1 is always unlocked. Module N requires module N-1 practicalDone === true.
 */
export function isModuleLocked(progress, courseId, modules, moduleIndex) {
    if (moduleIndex === 0) return false
    const prevModule = modules[moduleIndex - 1]
    const prevProgress = getModuleProgress(progress, courseId, prevModule.id)
    return !prevProgress.practicalDone
}

/**
 * Count completed modules (practicalDone) for a course.
 */
export function countCompletedModules(progress, courseId, modules) {
    return modules.filter(m => getModuleProgress(progress, courseId, m.id).practicalDone).length
}

/**
 * Calculate the default step to show for a module based on its progress.
 */
export function getDefaultStep(moduleProgress) {
    if (!moduleProgress.lectureRead) return 'lecture'
    if (!moduleProgress.quizPassed) return 'quiz'
    return 'practical'
}
