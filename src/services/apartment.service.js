import { authHeader, handleResponse, fetchAPI } from '../helpers';

export const apartmentService = {
    fetchAll,
    create,
    update,
    delete: _delete,
    apartmentUrl: '/api/apartments/'
};

async function fetchAll(url=null) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    const response = await fetchAPI(url, requestOptions);
    return await handleResponse(response);
}

async function create(apartment) {
    const formData = new FormData();
    for ( var key in apartment ) {
        formData.append(key, apartment[key]);
    }
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader()},
        body: formData
    };

    const response = await fetchAPI(`/api/apartments/`, requestOptions);
    return await handleResponse(response);
}

async function update(apartment) {
    const formData = new FormData();
    for ( var key in apartment ) {
        formData.append(key, apartment[key]);
    }
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader()},
        body: formData
    };

    const response = await fetchAPI(`/api/apartments/${apartment.id}/`, requestOptions);
    return await handleResponse(response);
}

async function _delete(apartment) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    const response = await fetchAPI(`/api/apartments/${apartment.id}`, requestOptions);
    return await handleResponse(response);
}