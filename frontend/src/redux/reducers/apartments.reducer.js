import { apartmentConstants } from '../actionTypes';

export function apartments(state = {results: []}, action) {
  switch (action.type) {
    case apartmentConstants.FETCH_ALL_REQUEST:
    case apartmentConstants.UPDATE_REQUEST:
    case apartmentConstants.DELETE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case apartmentConstants.FETCH_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.apartments
      }

    case apartmentConstants.FETCH_ALL_FAILURE:
    case apartmentConstants.CREATE_FAILURE:
    case apartmentConstants.UPDATE_FAILURE:
    case apartmentConstants.DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case apartmentConstants.FILTER_APARTMENTS:
      return {
        ...state,
        filters: action.filters
      }
    default:
      return state
  }
}