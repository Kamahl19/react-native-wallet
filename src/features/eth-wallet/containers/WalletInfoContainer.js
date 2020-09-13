import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { NoActiveWallet } from '../../../common/components';
import { selectPrices } from '../../prices/ducks';

import { selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import WalletInfo from '../screens/WalletInfo';

const mapStateToProps = (state) => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  ethPrice: selectPrices(state).ETH,
});

const WalletInfoContainer = ({ activeWallet, activeWalletExtraData, ethPrice }) =>
  !activeWallet ? (
    <NoActiveWallet />
  ) : (
    <WalletInfo
      price={ethPrice ? ethPrice.USD : undefined}
      wallet={activeWallet}
      walletExtraData={activeWalletExtraData}
    />
  );

WalletInfoContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
  ethPrice: PropTypes.object,
};

export default connect(mapStateToProps)(WalletInfoContainer);
