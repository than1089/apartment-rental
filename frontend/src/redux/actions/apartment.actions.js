import { apartmentConstants } from '../actionTypes';
import { apartmentService } from '../../services';
import { alertActions } from '.';
import { buildSearchURL } from '../../helpers/utils';

const apartmentsPath = '/api/apartments/';

export const apartmentActions = {
  fetchAll,
  create,
  update,
  delete: _delete,
  filterApartments,
};

function fetchAll(url=apartmentsPath) {
  return dispatch => {
    dispatch(request());

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
          dispatch(success(apartment))
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
          dispatch(success(apartment))
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
    const url = buildSearchURL(apartmentsPath, filters);
    dispatch(fetchAll(url));
  }
  function setFilters(filters) { return { type: apartmentConstants.FILTER_APARTMENTS, filters } }
}