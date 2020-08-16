import { authHeader, handleResponse } from '../helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    verifyEmail,
    loginSocial,
    invite,
    uploadAvatar,
};

async function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    const response = await fetch(`rest-auth/login/`, requestOptions);
    const auth = await handleResponse(response);
    storeAuth(auth);
    return auth;
}

async function logout() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    await fetch(`rest-auth/logout/`, requestOptions);
    
    localStorage.removeItem('auth');
    return true;
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

async function update(user) {
    const requestOptions = {
        method: 'PATCH',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    const response = await fetch(`/api/users/${user.id}/`, requestOptions);
    return handleResponse(response);;
}

async function _delete(user) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    const response = await fetch(`/api/users/${user.id}`, requestOptions);
    return handleResponse(response);
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

async function loginSocial(provider, accessToken) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({access_token: accessToken})
    };

    const response = await fetch(`/rest-auth/${provider}/`, requestOptions);
    const auth = await handleResponse(response);
    storeAuth(auth);
    return auth;
}

function storeAuth(auth) {
    localStorage.setItem('auth', JSON.stringify(auth));
}

async function invite(email) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    };

    const response = await fetch(`/api/users/invite/`, requestOptions);
    return await handleResponse(response)
}

async function uploadAvatar(userId, files) {
    const formData = new FormData();
    formData.append('profile_img', files[0], files[0].name);
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader()},
        body: formData
    };
    const response = await fetch(`/api/users/${userId}/upload_avatar/`, requestOptions);
    return await handleResponse(response);
}