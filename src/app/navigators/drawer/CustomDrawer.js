import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { DrawerItems } from 'react-navigation';

import WalletSummaryContainer from '../../../features/wallet/containers/WalletSummaryContainer';
import { View } from '../../../common/components';
import DrawerItem from './DrawerItem';

const CustomDrawer = ({ ...rest }) => (
  <View style={styles.component}>
    <DrawerItems {...rest} />
    <DrawerItem label={<WalletSummaryContainer />} />
  </View>
);

export default CustomDrawer;

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
