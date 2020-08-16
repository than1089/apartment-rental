import { apartmentConstants } from '../actionTypes';
import { apartmentService } from '../../services';
import { alertActions } from '.';
import { store } from '../../helpers/store';


export const apartmentActions = {
  fetchAll,
  create,
  update,
  delete: _delete,
  setFilters,
  setManagementUrl,
};

function setManagementUrl(url) {
  return {
    type: apartmentConstants.SET_MANAGEMENT_URL,
    url
  }
}

function getManagementUrl() {
  return store.getState().apartments.managementUrl;
}

function fetchAll(url=null, page='list') {
  return dispatch => {
    dispatch(request());
    apartmentService.fetchAll(url)
      .then(
        apartments => {
          dispatch(success(apartments, page));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: apartmentConstants.FETCH_ALL_REQUEST } }
  function success(apartments) { return { type: apartmentConstants.FETCH_ALL_SUCCESS, apartments, page } }
  function failure(error) { return { type: apartmentConstants.FETCH_ALL_FAILURE, error } }
}

function create(apartment) {
  return dispatch => {
    dispatch(request());

    apartmentService.create(apartment)
      .then(
        apartment => {
          dispatch(success(apartment));
          dispatch(alertActions.success('Created successfully!'));
          dispatch(fetchAll(getManagementUrl(), 'management'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: apartmentConstants.CREATE_REQUEST } }
  function success(apartment) { return { type: apartmentConstants.CREATE_SUCCESS, apartment } }
  function failure(error) { return { type: apartmentConstants.CREATE_FAILURE, error } }
}

function update(apartment) {
  return dispatch => {
    dispatch(request());

    apartmentService.update(apartment)
      .then(
        apartment => {
          dispatch(success(apartment));
          dispatch(alertActions.success('Updated successfully!'));
          dispatch(fetchAll(getManagementUrl(), 'management'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: apartmentConstants.UPDATE_REQUEST } }
  function success(apartment) { return { type: apartmentConstants.UPDATE_SUCCESS, apartment } }
  function failure(error) { return { type: apartmentConstants.UPDATE_FAILURE, error } }
}

function _delete(apartment) {
  return dispatch => {
    dispatch(request());

    apartmentService.delete(apartment)
      .then(
        () => {
          dispatch(success(apartment));
          dispatch(alertActions.success('Deleted successfully!'));
          dispatch(fetchAll(getManagementUrl(), 'management'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: apartmentConstants.DELETE_REQUEST } }
  function success(apartment) { return { type: apartmentConstants.DELETE_SUCCESS, apartment } }
  function failure(error) { return { type: apartmentConstants.DELETE_FAILURE, error } }
}

function setFilters(filters) { return { type: apartmentConstants.SET_FILTERS, filters } }