export function authHeader() {
    // return authorization header with jwt token
    let auth = JSON.parse(localStorage.getItem('auth'));

    if (auth && auth.token) {
        return { 'Authorization': 'JWT ' + auth.token };
    } else {
        return {};
    }
}