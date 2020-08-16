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
    case userConstants.UPDATE_SUCCESS:
      const results = state.results.slice();
      for (let i = 0; i < results.length; i++) {
        if (results[i].id === action.user.id) {
          results[i] = action.user;
          break;
        }
      }
      return {
        ...state,
        results
      }
    case userConstants.DELETE_SUCCESS:
    case userConstants.FETCH_ALL_FAILURE:
    case userConstants.CREATE_FAILURE:
    case userConstants.UPDATE_FAILURE:
    case userConstants.DELETE_FAILURE:
    default:
      return state
  }
}