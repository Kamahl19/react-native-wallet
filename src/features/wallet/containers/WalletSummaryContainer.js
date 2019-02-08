import React from 'react';
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

const WalletSummaryContainer = ({ activeWallet, activeWalletExtraData, prices }) => {
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
};

WalletSummaryContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
  prices: PropTypes.object,
};

export default connect(mapStateToProps)(WalletSummaryContainer);
