import axios from 'axios';

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
