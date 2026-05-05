// src/App.jsx
// Обновлённый App с авторизацией и защищёнными маршрутами

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { themes } from './styles/themes'
import { useTheme } from './context/ThemeContext'

import { ErrorBoundary } from './components/ErrorBoundary'
import Sidebar   from './components/Sidebar'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Theory    from './pages/Theory'
import Tasks     from './pages/Tasks'
import LessonPlans from './pages/LessonPlans'
import Sandbox   from './pages/Sandbox'
import Students  from './pages/Students'
import Progress  from './pages/Progress'
import AdminPanel from './pages/AdminPanel'
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTasks from "./pages/student/StudentTasks";
import StudentProgress from "./pages/student/StudentProgress";
import StudentTheory from "./pages/student/StudentTheory";
import StudentSandbox from "./pages/student/StudentSandbox";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";
import StudentModuleView from "./pages/student/StudentModuleView";

// ─── Защищённый маршрут ───────────────────────────────────────────────────────

// Пускает только если пользователь залогинен и его роль входит в allowedRoles
function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth()

    if (loading) return null

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return children
}

// ─── Учительский лэйаут (сайдбар + страница) ─────────────────────────────────

function TeacherLayout({ children }) {
    const { theme } = useTheme()
    const t = themes[theme]

    return (
        <div style={{ display: 'flex', height: '100vh', background: t.bg }}>
            <Sidebar />
            <main style={{ flex: 1, overflow: 'auto' }}>
                {children}
            </main>
        </div>
    )
}

// ─── Роутинг ─────────────────────────────────────────────────────────────────

function AppRoutes() {
    const { user, loading } = useAuth()

    return (
        <Routes>

            {/* Публичный маршрут */}
            <Route
                path="/login"
                element={
                    loading ? null
                    : user
                        ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'student' ? '/student' : '/'} replace />
                        : <Login />
                }
            />

            {/* Учительские маршруты */}
            <Route path="/" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherLayout><Dashboard /></TeacherLayout>
                </ProtectedRoute>
            } />

            <Route path="/theory" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherLayout><Theory /></TeacherLayout>
                </ProtectedRoute>
            } />

            <Route path="/tasks" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherLayout><Tasks /></TeacherLayout>
                </ProtectedRoute>
            } />

            <Route path="/lessons" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherLayout><LessonPlans /></TeacherLayout>
                </ProtectedRoute>
            } />

            <Route path="/sandbox" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherLayout><Sandbox /></TeacherLayout>
                </ProtectedRoute>
            } />

            {/* Только для учителя и админа */}
            <Route path="/students" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherLayout><Students /></TeacherLayout>
                </ProtectedRoute>
            } />

            <Route path="/progress" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherLayout><Progress /></TeacherLayout>
                </ProtectedRoute>
            } />

            {/* Админ панель — добавим позже */}
            {/* <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminPanel />
        </ProtectedRoute>
      } /> */}

            {/* Временный редирект для /admin пока нет страницы */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <TeacherLayout><AdminPanel /></TeacherLayout>
                </ProtectedRoute>
            } />

            {/* Ученик — добавим позже */}
            {/* <Route path="/student/*" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentApp />
        </ProtectedRoute>
      } /> */}

            {/* Временный редирект для /student */}
            <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentDashboard /></TeacherLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/tasks" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentTasks /></TeacherLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/progress" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentProgress /></TeacherLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/theory" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentTheory /></TeacherLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/sandbox" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentSandbox /></TeacherLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/courses" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentCourses /></TeacherLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/courses/:id" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentCourseDetail /></TeacherLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/courses/:id/module/:moduleId" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <TeacherLayout><StudentModuleView /></TeacherLayout>
                </ProtectedRoute>
            } />

            {/* Любой неизвестный путь → логин */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    )
}

// ─── Корневой компонент ───────────────────────────────────────────────────────

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <ErrorBoundary>
                        <AppRoutes />
                    </ErrorBoundary>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    )
}
