import { userConstants } from '../actionTypes';
import { userService } from '../../services';
import { alertActions } from './';
import { history } from '../../helpers';

export const userActions = {
  login,
  logout,
  register,
  fetchAll,
  create,
  update,
  delete: _delete
};

function login(username, password) {
  return dispatch => {
    dispatch(request({ username }));

    userService.login(username, password)
      .then(
        auth => {
          dispatch(success(auth.user));
          history.push('/');
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(user) {
  return dispatch => {
    dispatch(request(user));

    userService.register(user)
      .then(
        response => {
          dispatch(success());
          dispatch(alertActions.success("Register successfully. Please check your inbox to verify your email address."));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
  function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function fetchAll() {
  return dispatch => {
    dispatch(request());

    userService.getAll()
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error.toString()))
      );
  };

  function request() { return { type: userConstants.FETCH_ALL_REQUEST } }
  function success(users) { return { type: userConstants.FETCH_ALL_SUCCESS, users } }
  function failure(error) { return { type: userConstants.FETCH_ALL_FAILURE, error } }
}

function create(user) {
  return dispatch => {
    dispatch(request(user));

    userService.create(user)
      .then(
        user => {
          dispatch(success(user));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(user) { return { type: userConstants.CREATE_REQUEST, user } }
  function success(user) { return { type: userConstants.CREATE_SUCCESS, user } }
  function failure(error) { return { type: userConstants.CREATE_FAILURE, error } }
}

function update(user) {
  return dispatch => {
    dispatch(request(user));

    userService.update(user)
      .then(
        user => {
          dispatch(success(user));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(user) { return { type: userConstants.UPDATE_REQUEST, user } }
  function success(user) { return { type: userConstants.UPDATE_SUCCESS, user } }
  function failure(error) { return { type: userConstants.UPDATE_FAILURE, error } }
}

function _delete(user) {
  return dispatch => {
    dispatch(request(user));

    userService.delete(user)
      .then(
        () => {
          dispatch(success(user));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(user) { return { type: userConstants.DELETE_REQUEST, user } }
  function success(user) { return { type: userConstants.DELETE_SUCCESS, user } }
  function failure(error) { return { type: userConstants.DELETE_FAILURE, error } }
}