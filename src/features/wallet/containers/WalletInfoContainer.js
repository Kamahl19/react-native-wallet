import React from 'react';
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

const WalletInfoContainer = ({ activeWallet, activeWalletExtraData }) =>
  !activeWallet ? (
    <NoActiveWallet />
  ) : (
    <WalletInfo
      wallet={activeWallet}
      balance={
        activeWalletExtraData.balance ? getWalletBalance(activeWalletExtraData.balance) : undefined
      }
    />
  );

WalletInfoContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
};

WalletInfoContainer.navigationOptions = {
  title: 'Wallet Info',
};

export default connect(mapStateToProps)(WalletInfoContainer);
