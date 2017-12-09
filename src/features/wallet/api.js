import apiClient from '../../common/services/apiClient';

export const apiCallIds = {
  CREATE_WALLET: 'CREATE_WALLET',
};

export default {
  createWallet: walletData =>
    apiClient.post('/wallets', walletData, {
      apiCallId: apiCallIds.CREATE_WALLET,
    }),
};
