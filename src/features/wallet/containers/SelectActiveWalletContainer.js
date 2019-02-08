import React, { Component } from 'react';
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

class SelectActiveWalletContainer extends Component {
  static propTypes = {
    wallets: PropTypes.array.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    selectActiveWallet: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Select Active Wallet',
  };

  render() {
    const { wallets, deleteWallet, selectActiveWallet } = this.props;

    return (
      <SelectActiveWallet
        selectActiveWallet={selectActiveWallet}
        deleteWallet={deleteWallet}
        wallets={wallets}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectActiveWalletContainer);
