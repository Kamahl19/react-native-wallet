import React from 'react';
import { DrawerNavigator } from 'react-navigation';

import CustomDrawer from './drawer/CustomDrawer';
import {
  CreateWalletContainer,
  SelectActiveWalletContainer,
  SendTransactionContainer,
  GenerateAddressContainer,
  WalletHistoryContainer,
  ExportWalletContainer,
  ImportWalletContainer,
} from '../../features/wallet/containers';

const AppNavigator = DrawerNavigator(
  {
    SelectActiveWallet: {
      screen: SelectActiveWalletContainer,
    },
    CreateWallet: {
      screen: CreateWalletContainer,
    },
    SendTransaction: {
      screen: SendTransactionContainer,
    },
    GenerateAddress: {
      screen: GenerateAddressContainer,
    },
    WalletHistory: {
      screen: WalletHistoryContainer,
    },
    ExportWallet: {
      screen: ExportWalletContainer,
    },
    ImportWallet: {
      screen: ImportWalletContainer,
    },
  },
  {
    initialRouteName: 'SelectActiveWallet',
    contentComponent: CustomDrawer,
    // TODO fixing bug in react-navigation, possibly remove later
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  }
);

export default AppNavigator;
