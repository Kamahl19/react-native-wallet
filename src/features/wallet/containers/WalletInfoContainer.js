import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import WalletInfo from '../components/WalletInfo';
import NoActiveWallet from '../components/NoActiveWallet';
import { getWalletBalance } from '../../../btcService';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
});

class WalletInfoContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    activeWalletExtraData: PropTypes.object,
  };

  static navigationOptions = {
    title: 'Wallet Info',
  };

  render() {
    const { activeWallet, activeWalletExtraData } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    const balance = activeWalletExtraData.balance
      ? getWalletBalance(activeWalletExtraData.balance)
      : undefined;

    return <WalletInfo wallet={activeWallet} balance={balance} />;
  }
}

export default connect(mapStateToProps)(WalletInfoContainer);
