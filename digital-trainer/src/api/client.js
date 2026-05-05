export const API_BASE = 'http://localhost:8084'

// Unauthenticated fetch for public endpoints (login, refresh).
export async function publicFetch(path, opts = {}) {
    return fetch(`${API_BASE}${path}`, {
        ...opts,
        headers: { 'Content-Type': 'application/json', ...opts.headers },
    })
}

// Domain helpers — each takes the authFetch from useAuth() and returns the parsed body.
// Usage: const topics = await topicsApi(authFetch).getAll()

export function topicsApi(authFetch) {
    return {
        getAll: () => authFetch('/api/topics').then(r => r.json()),
        getById: (id) => authFetch(`/api/topics/${id}`).then(r => r.json()),
    }
}

export function tasksApi(authFetch) {
    return {
        getAll: () => authFetch('/api/tasks').then(r => r.json()),
        getByTopic: (topicId) => authFetch(`/api/tasks?topicId=${topicId}`).then(r => r.json()),
        submit: (taskId, code) => authFetch(`/api/tasks/${taskId}/submit`, {
            method: 'POST',
            body: JSON.stringify({ code }),
        }).then(r => r.json()),
    }
}
