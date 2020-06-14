import { apartmentConstants } from '../actionTypes';
import { apartmentService } from '../../services';
import { alertActions } from '.';
import { buildSearchURL } from '../../helpers/utils';
import { store } from '../../helpers/store';


export const apartmentActions = {
  setBasePath,
  fetchAll,
  create,
  update,
  delete: _delete,
  filterApartments,
};

function setBasePath(path){
  return {
    type: apartmentConstants.SET_BASE_PATH,
    path
  }
}

function getBasePath() {
  return store.getState().apartments.base_path;
}

function fetchAll(url=null) {
  return dispatch => {
    dispatch(request());
    if (!url) {
      url = getBasePath();
    }
    apartmentService.fetchAll(url)
      .then(
        apartments => {
          dispatch(success(apartments));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: apartmentConstants.FETCH_ALL_REQUEST } }
  function success(apartments) { return { type: apartmentConstants.FETCH_ALL_SUCCESS, apartments } }
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
          dispatch(fetchAll());
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
          dispatch(fetchAll());
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
          dispatch(fetchAll());
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

function filterApartments(filters) {
  return dispatch => {
    dispatch(setFilters(filters));
    const url = buildSearchURL(getBasePath(), filters);
    dispatch(fetchAll(url));
  }
  function setFilters(filters) { return { type: apartmentConstants.FILTER_APARTMENTS, filters } }
}