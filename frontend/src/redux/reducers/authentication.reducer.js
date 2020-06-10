import { userConstants } from '../actionTypes';

let auth = JSON.parse(localStorage.getItem('auth'));
const initialState = auth ? { loggedIn: true, user: auth.user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    case userConstants.VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        verifyingEmail: true
      }
    case userConstants.VERIFY_EMAIL_SUCCESS:
      return {
        verifiedEmail: true
      }
    case userConstants.VERIFY_EMAIL_FAILURE:
      return {
        verifiedEmail: false
      }
    default:
      return state
  }
}