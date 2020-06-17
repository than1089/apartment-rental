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
  delete: _delete,
  verifyEmail,
  loginSocial,
  invite,
  uploadAvatar,
};

const usersPath = '/api/users/';

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
          dispatch(failure(error));
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
        () => {
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

function fetchAll(url=usersPath) {
  return dispatch => {
    dispatch(request());

    userService.getAll(url)
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error))
      );
  };

  function request() { return { type: userConstants.FETCH_ALL_REQUEST } }
  function success(users) { return { type: userConstants.FETCH_ALL_SUCCESS, users } }
  function failure(error) { return { type: userConstants.FETCH_ALL_FAILURE, error } }
}

function create(user) {
  return dispatch => {
    dispatch(request(user));

    userService.register(user)
      .then(
        user => {
          dispatch(success(user));
          dispatch(fetchAll());
          dispatch(alertActions.success('Created successfully. User needs to verify their email before logging in.'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
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
          dispatch(alertActions.success('Updated successfully!'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
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
          dispatch(fetchAll());
          dispatch(alertActions.success('Deleted successfully.'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) { return { type: userConstants.DELETE_REQUEST, user } }
  function success(user) { return { type: userConstants.DELETE_SUCCESS, user } }
  function failure(error) { return { type: userConstants.DELETE_FAILURE, error } }
}

function verifyEmail(key) {
  return dispatch => {
    dispatch(request(key));

    userService.verifyEmail(key)
      .then(
        () => {
          dispatch(success());
        },
        error => {
          dispatch(failure(error.toString()));
        }
      );
  };

  function request() { return { type: userConstants.VERIFY_EMAIL_REQUEST } }
  function success() { return { type: userConstants.VERIFY_EMAIL_SUCCESS } }
  function failure(error) { return { type: userConstants.VERIFY_EMAIL_FAILURE, error } }
}

function loginSocial(provider, accessToken) {
  return dispatch => {
    dispatch(request());

    userService.loginSocial(provider, accessToken)
      .then(
        (auth) => {
          dispatch(success(auth.user));
          history.push('/');
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error('Login failed. This email may be registered by another method. Please change your login method.'));
        }
      );
  };

  function request() { return { type: userConstants.LOGIN_SOCIAL_REQUEST } }
  function success(user) { return { type: userConstants.LOGIN_SOCIAL_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_SOCIAL_FAILURE, error } }
}

function invite(email) {
  return dispatch => {
    dispatch(request());

    userService.invite(email)
      .then(
        () => {
          dispatch(success());
          dispatch(alertActions.success("Invitation sent!"));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: userConstants.INVITE_USER_REQUEST } }
  function success() { return { type: userConstants.INVITE_USER_SUCCESS } }
  function failure(error) { return { type: userConstants.INVITE_USER_FAILURE, error } }
}

function uploadAvatar(userId, files) {
  return dispatch => {
    dispatch(request());

    userService.uploadAvatar(userId, files)
      .then(
        (response) => {
          dispatch(success(response.profile_img));
          dispatch(alertActions.success("Uploaded successfully!"));
          updateToLocalStorage(response.profile_img);
        },
        error => {
          dispatch(failure());
          dispatch(alertActions.error(error));
        }
      );
  };

  function updateToLocalStorage(profile_img) {
    const auth = JSON.parse(localStorage.getItem('auth'));
    auth.user.profile_img = process.env.REACT_APP_BACKEND_HOST + profile_img;
    localStorage.setItem('auth', JSON.stringify(auth));
  }

  function request() { return { type: userConstants.UPLOAD_AVATAR_REQUEST } }
  function success(profile_img) { return { type: userConstants.UPLOAD_AVATAR_SUCCESS, profile_img } }
  function failure() { return { type: userConstants.UPLOAD_AVATAR_FAILURE } }
}

