import { apartmentConstants } from '../actionTypes';
import { apartmentService } from '../../services';


const initState = {
  list: {results: []},
  map: {results: []},
  management: {results: []},
  filters: null,
  managementUrl: apartmentService.apartmentUrl
}

export function apartments(state = initState, action) {
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
        [action.page]: action.apartments
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
    case apartmentConstants.CREATE_SUCCESS:
    case apartmentConstants.UPDATE_SUCCESS:
    case apartmentConstants.DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case apartmentConstants.SET_FILTERS:
      return {
        ...state,
        filters: action.filters
      }
    case apartmentConstants.SET_MANAGEMENT_URL:
      return {
        ...state,
        managementUrl: action.url
      }
    default:
      return state
  }
}