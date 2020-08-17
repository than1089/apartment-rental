import { userService } from '../services/user.service';
import { history } from '../helpers/history';

export function handleResponse(response) {
    return response.text().then(text => {
        if (!response.ok) {
            if (response.status === 401 && !window.location.pathname.match(/^\/login/)) {
                // auto logout if 401 response returned from api
                userService.logout();
                history.push('/login');
            }
            return Promise.reject(JSON.parse(text));
        }
        try {
            return JSON.parse(text);
        } catch (error) {
            return {};
        }
    });
}

export function fetchAPI(path, headers) {
    const domain = process.env.REACT_APP_BACKEND_HOST || ''; 
    return fetch(`${domain}${path}`, headers);
} 