import React from 'react';
import {
  createDrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import { DrawerButton, Text } from '../common/components';

import AddressesContainerBtc from '../features/btc-wallet/containers/AddressesContainer';
import CreateWalletContainerBtc from '../features/btc-wallet/containers/CreateWalletContainer';
import ExportWalletContainerBtc from '../features/btc-wallet/containers/ExportWalletContainer';
import GenerateAddressContainerBtc from '../features/btc-wallet/containers/GenerateAddressContainer';
import ImportWalletContainerBtc from '../features/btc-wallet/containers/ImportWalletContainer';
import SelectActiveWalletContainerBtc from '../features/btc-wallet/containers/SelectActiveWalletContainer';
import SendTransactionContainerBtc from '../features/btc-wallet/containers/SendTransactionContainer';
import TransactionsContainerBtc from '../features/btc-wallet/containers/TransactionsContainer';
import WalletInfoContainerBtc from '../features/btc-wallet/containers/WalletInfoContainer';

import CreateWalletContainerEth from '../features/eth-wallet/containers/CreateWalletContainer';
import ExportWalletContainerEth from '../features/eth-wallet/containers/ExportWalletContainer';
import ImportWalletContainerEth from '../features/eth-wallet/containers/ImportWalletContainer';
import SelectActiveWalletContainerEth from '../features/eth-wallet/containers/SelectActiveWalletContainer';
import SendTransactionContainerEth from '../features/eth-wallet/containers/SendTransactionContainer';
import TransactionsContainerEth from '../features/eth-wallet/containers/TransactionsContainer';
import WalletInfoContainerEth from '../features/eth-wallet/containers/WalletInfoContainer';

export default createBottomTabNavigator({
  Btc: {
    screen: createDrawerNavigator({
      SelectActiveWallet: createSubNavigator(
        SelectActiveWalletContainerBtc,
        'Select Active Wallet'
      ),
      WalletInfo: createSubNavigator(WalletInfoContainerBtc, 'Wallet Info'),
      CreateWallet: createSubNavigator(CreateWalletContainerBtc, 'Create Wallet'),
      SendTransaction: createSubNavigator(SendTransactionContainerBtc, 'Send Transaction'),
      GenerateAddress: createSubNavigator(GenerateAddressContainerBtc, 'Generate Address'),
      Addresses: createSubNavigator(AddressesContainerBtc, 'Addresses'),
      Transactions: createSubNavigator(TransactionsContainerBtc, 'Transactions'),
      ExportWallet: createSubNavigator(ExportWalletContainerBtc, 'Backup Wallet'),
      ImportWallet: createSubNavigator(ImportWalletContainerBtc, 'Restore Wallet'),
    }),
    navigationOptions: { tabBarIcon: <Text>₿</Text>, title: 'Bitcoin' },
  },
  Eth: {
    screen: createDrawerNavigator({
      SelectActiveWallet: createSubNavigator(
        SelectActiveWalletContainerEth,
        'Select Active Wallet'
      ),
      WalletInfo: createSubNavigator(WalletInfoContainerEth, 'Wallet Info'),
      CreateWallet: createSubNavigator(CreateWalletContainerEth, 'Create Wallet'),
      SendTransaction: createSubNavigator(SendTransactionContainerEth, 'Send Transaction'),
      Transactions: createSubNavigator(TransactionsContainerEth, 'Transactions'),
      ExportWallet: createSubNavigator(ExportWalletContainerEth, 'Backup Wallet'),
      ImportWallet: createSubNavigator(ImportWalletContainerEth, 'Restore Wallet'),
    }),
    navigationOptions: { tabBarIcon: <Text>Ξ</Text>, title: 'Ethereum' },
  },
});

function createSubNavigator(screen, title) {
  return {
    screen: createStackNavigator({
      Main: {
        screen,
        navigationOptions: ({ navigation }) => ({
          headerLeft: <DrawerButton onPress={navigation.openDrawer} />,
          title,
        }),
      },
    }),
    navigationOptions: {
      title,
    },
  };
}
