const BASE_URL = 'https://notes-api.dicoding.dev/v1';

function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function putAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
}

function clearAccessToken() {
    localStorage.removeItem('accessToken');
}

async function fetchWithToken(url, options = {}) {
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${getAccessToken()}`,
    };
    return fetch(url, { ...options, headers });
}

async function handleResponse(response) {
    let json = {};
    try {
        json = await response.json();
    } catch (_) {
        // ignore JSON parse error
    }

    // Sukses di API ditandai status: "success"
    if (response.ok && json.status === 'success') {
        return {
            error: false,
            data: json.data ?? null,
            message: json.message ?? '',
        };
    }

    // Kalau gagal, kembalikan pesan dari server
    return {
        error: true,
        data: null,
        message: json.message || response.statusText || 'Request failed',
    };
}

// POST /register
async function register({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
}

// POST /login
async function login({ email, password }) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
}

// GET /users/me
async function getUserLogged() {
    const res = await fetchWithToken(`${BASE_URL}/users/me`, {
        method: 'GET',
    });
    return handleResponse(res);
}

// GET /notes
async function getActiveNotes() {
    const res = await fetchWithToken(`${BASE_URL}/notes`, { method: 'GET' });
    return handleResponse(res);
}

// GET /notes/archived
async function getArchivedNotes() {
    const res = await fetchWithToken(`${BASE_URL}/notes/archived`, { method: 'GET' });
    return handleResponse(res);
}

// GET /notes/:id
async function getNote(id) {
    const res = await fetchWithToken(`${BASE_URL}/notes/${id}`, { method: 'GET' });
    return handleResponse(res);
}

// POST /notes
async function addNote({ title, body }) {
    const res = await fetchWithToken(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
    });
    return handleResponse(res);
}

// DELETE /notes/:id
async function deleteNote(id) {
    const res = await fetchWithToken(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
    return handleResponse(res);
}

// POST /notes/:id/archive
async function archiveNote(id) {
    const res = await fetchWithToken(`${BASE_URL}/notes/${id}/archive`, { method: 'POST' });
    return handleResponse(res);
}

// POST /notes/:id/unarchive
async function unarchiveNote(id) {
    const res = await fetchWithToken(`${BASE_URL}/notes/${id}/unarchive`, { method: 'POST' });
    return handleResponse(res);
}

export {
    // token helpers
    getAccessToken,
    putAccessToken,
    clearAccessToken,

    // auth
    register,
    login,
    getUserLogged,

    // notes
    getActiveNotes,
    getArchivedNotes,
    getNote,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
};
