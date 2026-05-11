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

    return (
        <AuthContext.Provider value={{ user, accessToken, loading, authFetch, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
