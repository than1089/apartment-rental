import { authHeader, handleResponse } from '../helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    verifyEmail,
};

async function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    const response = await fetch(`rest-auth/login/`, requestOptions);
    const auth = await handleResponse(response);
    // store jwt value into localstorage
    localStorage.setItem('auth', JSON.stringify(auth));
    return auth;
}

function logout() {
    // remove token from local storage to log user out
    localStorage.removeItem('token');
}

async function getAll(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

async function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`/api/users/${id}`, requestOptions);
    return handleResponse(response);
}

async function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    const response = await fetch(`/rest-auth/registration/`, requestOptions);
    return handleResponse(response);
}

async function create(user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    const response = await fetch(`/api/users`, requestOptions);
    return handleResponse(response);
}

async function update(user) {
    const requestOptions = {
        method: 'PATCH',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    const response = await fetch(`/api/users/${user.id}`, requestOptions);
    return handleResponse(response);;
}

async function _delete(user) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    const response = await fetch(`/api/users/${user.id}`, requestOptions);
    return handleResponse(response);;
}

async function verifyEmail(key) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({key})
    };

    const response = await fetch('/rest-auth/registration/verify-email/', requestOptions);
    return handleResponse(response);;
}