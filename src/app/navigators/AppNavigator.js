import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DrawerNavigator } from 'react-navigation';

import CustomDrawer from './drawer/CustomDrawer';
import { selectIsLoggedIn } from '../../features/auth/ducks';
import AuthNavigator from '../../features/auth/AuthNavigator';
import { CreateWalletContainer, LoadWalletContainer } from '../../features/wallet/containers';

const UserNavigator = DrawerNavigator(
  {
    CreateWallet: {
      screen: CreateWalletContainer,
    },
    LoadWallet: {
      screen: LoadWalletContainer,
    },
  },
  {
    initialRouteName: 'LoadWallet',
    contentComponent: CustomDrawer,
  }
);

const mapStateToProps = state => ({
  isLoggedIn: selectIsLoggedIn(state),
});

const AppNavigator = ({ isLoggedIn }) => (isLoggedIn ? <UserNavigator /> : <AuthNavigator />);

AppNavigator.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(AppNavigator);
