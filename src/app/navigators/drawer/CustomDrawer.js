import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import { DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';

import { logout, selectUserEmail } from '../../../features/auth/ducks';
import ActiveWalletInfo from '../../../features/wallet/components/ActiveWalletInfo';
import { View } from '../../../common/components';
import DrawerItem from './DrawerItem';

const mapStateToProps = state => ({
  email: selectUserEmail(state),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

const CustomDrawer = ({ email, activeWallet, logout, ...rest }) => (
  <View style={styles.component}>
    <DrawerItem label={`Hi ${email}`} />
    <DrawerItems {...rest} />
    <DrawerItem label={<ActiveWalletInfo />} />
    <DrawerItem label="Logout" onPress={logout} />
  </View>
);

CustomDrawer.propTypes = {
  email: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
