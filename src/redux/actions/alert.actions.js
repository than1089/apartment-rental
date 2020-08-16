import { alertConstants } from '../actionTypes';

export const alertActions = {
    success,
    error,
    clear
};

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(message) {
    if (typeof message === 'object') {
        message = Object.values(message).flat().join(' ');
    }
    message = message || "Something went wrong! Please try again later.";
    return { type: alertConstants.ERROR, message };
}

function clear() {
    return { type: alertConstants.CLEAR };
}