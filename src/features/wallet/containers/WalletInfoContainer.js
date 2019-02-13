import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getWalletBalance } from '../../../btcService';
import { selectPriceForActiveWallet } from '../../prices/ducks';

import { selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import NoActiveWallet from '../components/NoActiveWallet';
import WalletInfo from '../screens/WalletInfo';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  prices: selectPriceForActiveWallet(state),
});

const WalletInfoContainer = ({ activeWallet, activeWalletExtraData, prices }) =>
  !activeWallet ? (
    <NoActiveWallet />
  ) : (
    <WalletInfo
      balance={
        activeWalletExtraData.balance ? getWalletBalance(activeWalletExtraData.balance) : undefined
      }
      price={prices ? prices.USD : undefined}
      wallet={activeWallet}
    />
  );

WalletInfoContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
  prices: PropTypes.object,
};

export default connect(mapStateToProps)(WalletInfoContainer);
