import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import { DrawerButton } from '../common/components';
import CreateWalletContainer from '../features/wallet/containers/CreateWalletContainer';
import SelectActiveWalletContainer from '../features/wallet/containers/SelectActiveWalletContainer';
import SendTransactionContainer from '../features/wallet/containers/SendTransactionContainer';
import GenerateAddressContainer from '../features/wallet/containers/GenerateAddressContainer';
import AddressesContainer from '../features/wallet/containers/AddressesContainer';
import TransactionsContainer from '../features/wallet/containers/TransactionsContainer';
import ExportWalletContainer from '../features/wallet/containers/ExportWalletContainer';
import ImportWalletContainer from '../features/wallet/containers/ImportWalletContainer';
import WalletInfoContainer from '../features/wallet/containers/WalletInfoContainer';

export default createDrawerNavigator({
  SelectActiveWallet: createSubNavigator(SelectActiveWalletContainer, 'Select Active Wallet'),
  CreateWallet: createSubNavigator(CreateWalletContainer, 'Create Wallet'),
  SendTransaction: createSubNavigator(SendTransactionContainer, 'Send Transaction'),
  GenerateAddress: createSubNavigator(GenerateAddressContainer, 'Generate Address'),
  Addresses: createSubNavigator(AddressesContainer, 'Addresses'),
  Transactions: createSubNavigator(TransactionsContainer, 'Transactions'),
  ExportWallet: createSubNavigator(ExportWalletContainer, 'Backup Wallet'),
  ImportWallet: createSubNavigator(ImportWalletContainer, 'Restore Wallet'),
  WalletInfo: createSubNavigator(WalletInfoContainer, 'Wallet Info'),
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
