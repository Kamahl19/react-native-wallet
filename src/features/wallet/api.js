import apiClient from '../../common/services/apiClient';

export const apiCallIds = {
  FETCH_WALLETS: 'FETCH_WALLETS',
  CREATE_WALLET: 'CREATE_WALLET',
  SEND_TRANSACTION: 'SEND_TRANSACTION',
  GENERATE_ADDRESS: 'GENERATE_ADDRESS',
};

export default {
  fetchWallets: () =>
    apiClient.get('/wallets', {
      apiCallId: apiCallIds.FETCH_WALLETS,
    }),

  createWallet: walletData =>
    apiClient.post('/wallets', walletData, {
      apiCallId: apiCallIds.CREATE_WALLET,
    }),

  sendTransaction: (walletId, transactionData) =>
    apiClient.post(`/wallets/${walletId}/send`, transactionData, {
      apiCallId: apiCallIds.SEND_TRANSACTION,
    }),

  generateAddress: (walletId, password) =>
    apiClient.post(
      `/wallets/${walletId}/generate-address`,
      { password },
      {
        apiCallId: apiCallIds.GENERATE_ADDRESS,
      }
    ),
};
