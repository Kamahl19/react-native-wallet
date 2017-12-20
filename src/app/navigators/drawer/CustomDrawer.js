import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import { DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';

import { logout, selectUserEmail } from '../../../features/auth/ducks';
import { selectActiveWallet } from '../../../features/wallet/ducks';
import { View, Text } from '../../../common/components';
import DrawerItem from './DrawerItem';

const mapStateToProps = state => ({
  email: selectUserEmail(state),
  activeWallet: selectActiveWallet(state),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

const CustomDrawer = ({ email, activeWallet, logout, ...rest }) => (
  <View style={styles.component}>
    <DrawerItem label={`Hi ${email}`} />
    <DrawerItems {...rest} />
    {activeWallet && (
      <DrawerItem
        label={
          <View>
            <Text>Network: {activeWallet.network}</Text>
            <Text>Coin: {activeWallet.coin}</Text>
            <Text>Wallet Name: {activeWallet.name}</Text>
          </View>
        }
      />
    )}
    {!activeWallet && <DrawerItem label={<Text>No Active Wallet</Text>} />}
    <DrawerItem label="Logout" onPress={logout} />
  </View>
);

CustomDrawer.propTypes = {
  email: PropTypes.string.isRequired,
  activeWallet: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
