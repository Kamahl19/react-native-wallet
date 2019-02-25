import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { NoActiveWallet } from '../../../common/components';
import { getWalletBalance } from '../../../btcService';
import { selectPrices } from '../../prices/ducks';

import { selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import WalletInfo from '../screens/WalletInfo';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  btcPrice: selectPrices(state).BTC,
});

const WalletInfoContainer = ({ activeWallet, activeWalletExtraData, btcPrice }) =>
  !activeWallet ? (
    <NoActiveWallet />
  ) : (
    <WalletInfo
      balance={
        activeWalletExtraData.balance ? getWalletBalance(activeWalletExtraData.balance) : undefined
      }
      price={btcPrice ? btcPrice.USD : undefined}
      wallet={activeWallet}
    />
  );

WalletInfoContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
  btcPrice: PropTypes.object,
};

export default connect(mapStateToProps)(WalletInfoContainer);
