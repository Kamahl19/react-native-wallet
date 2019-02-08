import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectActiveWalletAction, deleteWalletAction, selectWallets } from '../ducks';
import SelectActiveWallet from '../components/SelectActiveWallet';

const mapStateToProps = state => ({
  wallets: selectWallets(state),
});

const mapDispatchToProps = {
  selectActiveWallet: selectActiveWalletAction,
  deleteWallet: deleteWalletAction,
};

const SelectActiveWalletContainer = ({ wallets, selectActiveWallet, deleteWallet }) => (
  <SelectActiveWallet
    selectActiveWallet={selectActiveWallet}
    deleteWallet={deleteWallet}
    wallets={wallets}
  />
);

SelectActiveWalletContainer.propTypes = {
  wallets: PropTypes.array.isRequired,
  selectActiveWallet: PropTypes.func.isRequired,
  deleteWallet: PropTypes.func.isRequired,
};

SelectActiveWalletContainer.navigationOptions = {
  title: 'Select Active Wallet',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectActiveWalletContainer);
