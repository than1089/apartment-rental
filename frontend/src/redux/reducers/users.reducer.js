import { userConstants } from '../actionTypes';

export function users(state = {}, action) {
  let items = [];
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
        items: action.users,
      };
    case userConstants.FETCH_ALL_FAILURE:
    case userConstants.CREATE_FAILURE:
    case userConstants.UPDATE_FAILURE:
    case userConstants.DELETE_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case userConstants.CREATE_SUCCESS:
      return {
        items: state.items.concat(action.user),
      }
  
    case userConstants.UPDATE_SUCCESS:
      items = state.items.slice();
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === action.user.id) {
          items[i] = action.user;
          break;
        }
      }      
      return {
        items,
      }
    
    case userConstants.DELETE_SUCCESS:
      items = state.items.slice();
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === action.user.id) {
          items.splice(i, 1)
          break;
        }
      }      
      return {
        items,
      }

    default:
      return state
  }
}