import axios from 'axios';

import { logout, selectToken } from '../../features/auth/ducks';
import { finishApiCall, startApiCall } from '../../features/spinner/ducks';
import config from '../../config';
import AlertService from './alert';

const apiClient = axios.create({
  responseType: 'json',
  baseURL: config.apiUrl,
});

export default apiClient;

export function prepareRequestInterceptor(store) {
  apiClient.interceptors.request.use(config => {
    const token = selectToken(store.getState());

    if (token) {
      config.headers.common = config.headers.common || {};
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }

    store.dispatch(
      startApiCall({
        apiCallId: config.apiCallId,
      })
    );

    return config;
  });
}

export function handleResponsesInterceptor(store) {
  apiClient.interceptors.response.use(
    response => {
      store.dispatch(
        finishApiCall({
          apiCallId: response.config.apiCallId,
        })
      );

      return normalizeSuccessResponse(response);
    },
    error => {
      store.dispatch(
        finishApiCall({
          apiCallId: error.config.apiCallId,
          error,
        })
      );

      if (error.response && error.response.status === 401) {
        store.dispatch(logout());
      }

      showErrorMessage(error);

      return normalizeErrorResponse(error);
    }
  );
}

function normalizeSuccessResponse(response) {
  return {
    ...response,
    ok: true,
  };
}

function normalizeErrorResponse(error) {
  return {
    ...error,
    ok: false,
  };
}

function showErrorMessage(error) {
  const errorMsg =
    error.response && error.response.data
      ? error.response.data.message || error.response.data.error.inner
      : error;

  if (Array.isArray(errorMsg)) {
    AlertService.error(errorMsg.reduce((acc, curr) => `${acc}\n${curr}`, ''));
  } else {
    AlertService.error(`${errorMsg}`);
  }
}
