import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DrawerNavigator } from 'react-navigation';

import { selectIsLoggedIn } from '../../features/auth/ducks';
import AuthNavigator from '../../features/auth/AuthNavigator';
import { ScreenWrapper, CenterView, Text } from '../../common/components';
import CustomDrawer from './drawer/CustomDrawer';

const DemoHomeScreen = () => (
  <ScreenWrapper>
    <CenterView>
      <Text>Slide right to open the Sider</Text>
    </CenterView>
  </ScreenWrapper>
);

DemoHomeScreen.navigationOptions = {
  drawerLabel: 'Home',
};

const UserNavigator = DrawerNavigator(
  {
    Home: {
      screen: DemoHomeScreen,
    },
  },
  {
    initialRouteName: 'Home',
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
