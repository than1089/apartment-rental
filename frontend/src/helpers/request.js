import { userService } from '../services/user.service';
import { history } from '../helpers/history';

export function handleResponse(response) {
    return response.json().then(json => {
        if (!response.ok) {
            if (response.status === 401 && !window.location.pathname.match(/^\/login/)) {
                // auto logout if 401 response returned from api
                userService.logout();
                history.push('/login');
            }

            return Promise.reject(json);
        }
        return json;
    });
}