import React from 'react';
import { DrawerNavigator } from 'react-navigation';

import CustomDrawer from './drawer/CustomDrawer';
import {
  CreateWalletContainer,
  SelectActiveWalletContainer,
  SendTransactionContainer,
  GenerateAddressContainer,
  WalletSettingsContainer,
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
    WalletSettings: {
      screen: WalletSettingsContainer,
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
