import apiClient from '../../common/services/apiClient';

export const apiCallIds = {
  SIGN_UP: 'SIGN_UP',
  LOGIN: 'LOGIN',
  FORGOTTEN_PASSWORD: 'FORGOTTEN_PASSWORD',
};

export default {
  signUp: userData => {
    delete userData.repeatPassword;

    return apiClient.post('/users', userData, {
      apiCallId: apiCallIds.SIGN_UP,
    });
  },

  login: credentials => {
    return apiClient.post('/auth/login', credentials, {
      apiCallId: apiCallIds.LOGIN,
    });
  },

  relogin: () => {
    return apiClient.get('/auth/relogin');
  },

  forgottenPassword: email => {
    return apiClient.post(
      '/auth/forgotten-password',
      { email },
      {
        apiCallId: apiCallIds.FORGOTTEN_PASSWORD,
      }
    );
  },
};
