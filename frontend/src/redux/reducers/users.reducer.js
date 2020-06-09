import { userConstants } from '../actionTypes';

export function users(state = {results: []}, action) {
  switch (action.type) {
    case userConstants.FETCH_ALL_REQUEST:
    case userConstants.UPDATE_REQUEST:
    case userConstants.DELETE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.FETCH_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.users
      }  
    case userConstants.FETCH_ALL_FAILURE:
    case userConstants.CREATE_FAILURE:
    case userConstants.UPDATE_FAILURE:
    case userConstants.DELETE_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state
  }
}