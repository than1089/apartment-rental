export function isValidEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export function buildSearchURL(url, searchObject) {
    const splitUrl = url.split('?');
    url = splitUrl[0];
    const searchParams = new URLSearchParams(splitUrl[1]);
    for (const key in searchObject) {
        if (searchObject.hasOwnProperty(key)) {
            const value = searchObject[key];
            searchParams.append(key, value);
        }
    }
    return url + '?' + searchParams.toString();
}