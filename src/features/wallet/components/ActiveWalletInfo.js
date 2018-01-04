import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectActiveWallet } from '../ducks';
import { View, Text } from '../../../common/components';

const mapStateToProps = state => ({
  wallet: selectActiveWallet(state),
});

const ActiveWalletInfo = ({ wallet }) =>
  wallet ? (
    <View>
      <Text>Wallet Name: {wallet.walletName}</Text>
      <Text>Network: {wallet.network}</Text>
    </View>
  ) : (
    <View>
      <Text>No Active Wallet</Text>
    </View>
  );

ActiveWalletInfo.propTypes = {
  wallet: PropTypes.object,
};

export default connect(mapStateToProps)(ActiveWalletInfo);
