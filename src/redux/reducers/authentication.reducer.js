import { userConstants } from '../actionTypes';

const auth = JSON.parse(localStorage.getItem('auth'));
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
    case userConstants.LOGIN_SOCIAL_REQUEST:
      return {
        ...state,
        loggingIn: true,
      }
    case userConstants.LOGIN_SOCIAL_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      }
    case userConstants.UPLOAD_AVATAR_REQUEST:
      return {
        ...state,
        uploadingAvatar: true
      }
    case userConstants.UPLOAD_AVATAR_SUCCESS:
      const user = Object.assign({}, state.user);
      user.profile_img = process.env.REACT_APP_BACKEND_HOST + '/' + action.profile_img;
      return {
        user
      }
    case userConstants.UPLOAD_AVATAR_FAILURE:
      return {
        ...state,
        uploadingAvatar: false
      }
    
    case userConstants.LOGIN_FAILURE:
    case userConstants.LOGOUT:
    case userConstants.LOGIN_SOCIAL_FAILURE:
      return {}
    default:
      return state
  }
}