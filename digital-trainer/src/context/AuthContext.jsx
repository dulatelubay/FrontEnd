import { createContext, useContext, useState, useEffect, useRef } from 'react'

const AuthContext = createContext()

const API = 'http://localhost:8084'

export function AuthProvider({ children }) {
    const [user, setUser]               = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading]         = useState(true)

    // Ref so authFetch always reads the latest token without stale closures
    const tokenRef = useRef(null)

    function applySession(data) {
        tokenRef.current = data.accessToken
        setAccessToken(data.accessToken)
        setUser(data.user)
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken)
        }
    }

    // Restore session from refreshToken on mount
    useEffect(() => {
        const rt = localStorage.getItem('refreshToken')
        if (!rt) { setLoading(false); return }

        fetch(`${API}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: rt }),
        })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => applySession(data))
            .catch(() => localStorage.removeItem('refreshToken'))
            .finally(() => setLoading(false))
    }, [])

    async function login(email, password) {
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                return { success: false, error: 'Неверный email или пароль' }
            }

            const data = await res.json()
            applySession(data)
            return { success: true, user: data.user }
        } catch {
            return { success: false, error: 'Ошибка соединения с сервером' }
        }
    }

    function logout() {
        const rt = localStorage.getItem('refreshToken')
        if (tokenRef.current) {
            fetch(`${API}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenRef.current}`,
                    'Content-Type': 'application/json',
                },
                body: rt ? JSON.stringify({ refreshToken: rt }) : null,
            }).catch(() => {})
        }
        tokenRef.current = null
        setUser(null)
        setAccessToken(null)
        localStorage.removeItem('refreshToken')
    }

    // Authenticated fetch with automatic token refresh on 401
    async function authFetch(path, opts = {}) {
        const doRequest = (token) => fetch(`${API}${path}`, {
            ...opts,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...opts.headers,
            },
        })

        let res = await doRequest(tokenRef.current)

        if (res.status === 401 || res.status === 403) {
            const rt = localStorage.getItem('refreshToken')
            if (rt) {
                const refreshRes = await fetch(`${API}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: rt }),
                })
                if (refreshRes.ok) {
                    const data = await refreshRes.json()
                    applySession(data)
                    res = await doRequest(data.accessToken)
                } else {
                    logout()
                    throw new Error('Session expired')
                }
            } else {
                logout()
                throw new Error('Session expired')
            }
        }

        return res
    }

    // Kept as mock until the admin/user management API is built
    const SEED_USERS = [
        { id: 1, name: 'Администратор', email: 'admin@trainer.kz', password: 'admin123', role: 'admin' },
        { id: 2, name: 'Айгерим Серикқызы', email: 'aigerim@school.kz', password: 'teacher123', role: 'teacher' },
        { id: 3, name: 'Алия Нурланова', email: 'aliya@school.kz', password: 'student123', role: 'student' },
    ]

    const [users, setUsers] = useState(() => {
        try {
            const saved = localStorage.getItem('mockUsers')
            if (saved) return JSON.parse(saved)
        } catch {}
        return SEED_USERS
    })

    useEffect(() => {
        try {
            localStorage.setItem('mockUsers', JSON.stringify(users))
        } catch {}
    }, [users])

    function addUser(newUser) {
        const email = newUser.email.trim().toLowerCase()
        const name = newUser.name.trim()
        const password = newUser.password.trim()
        const role = newUser.role

        if (!name || !email || !password || !role) {
            return { success: false, error: 'Заполните все поля' }
        }

        if (users.some(account => account.email.toLowerCase() === email)) {
            return { success: false, error: 'Пользователь с таким email уже есть' }
        }

        const account = { id: Date.now(), name, email, password, role }
        setUsers(prev => [...prev, account])
        return { success: true, user: account }
    }

    function deleteUser(id) {
        const target = users.find(account => account.id === id)
        if (target && user?.email && target.email.toLowerCase() === user.email.toLowerCase()) {
            return { success: false, error: 'Нельзя удалить текущий аккаунт' }
        }
        setUsers(prev => prev.filter(account => account.id !== id))
        return { success: true }
    }

    return (
        <AuthContext.Provider value={{ user, accessToken, loading, authFetch, users, login, logout, addUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
