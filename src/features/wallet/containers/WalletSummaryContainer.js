import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getWalletBalance } from '../../../btcService';
import { selectPriceForActiveWallet } from '../../prices/ducks';
import { selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import WalletSummary from '../components/WalletSummary';

// TODO currently not visible

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  prices: selectPriceForActiveWallet(state),
});

const WalletSummaryContainer = ({ activeWallet, activeWalletExtraData, prices }) => (
  <WalletSummary
    wallet={activeWallet}
    balance={
      activeWalletExtraData && activeWalletExtraData.balance
        ? getWalletBalance(activeWalletExtraData.balance)
        : undefined
    }
    price={prices ? prices.USD : undefined}
  />
);

WalletSummaryContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
  prices: PropTypes.object,
};

export default connect(mapStateToProps)(WalletSummaryContainer);
