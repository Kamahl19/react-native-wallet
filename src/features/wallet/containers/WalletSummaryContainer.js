import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getWalletBalance } from '../../../btcService';
import { selectPriceForActiveWallet } from '../../prices/ducks';
import { selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import WalletSummary from '../components/WalletSummary';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  prices: selectPriceForActiveWallet(state),
});

class WalletSummaryContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    activeWalletExtraData: PropTypes.object,
    prices: PropTypes.object,
  };

  render() {
    const { activeWallet, activeWalletExtraData, prices } = this.props;

    const balance =
      activeWalletExtraData && activeWalletExtraData.balance
        ? getWalletBalance(activeWalletExtraData.balance)
        : undefined;

    return (
      <WalletSummary
        wallet={activeWallet}
        balance={balance}
        price={prices ? prices.USD : undefined}
      />
    );
  }
}

export default connect(mapStateToProps)(WalletSummaryContainer);
