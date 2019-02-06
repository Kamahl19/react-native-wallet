import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectActiveWalletAction, deleteWalletAction, selectWallets } from '../ducks';
import SelectActiveWallet from '../components/SelectActiveWallet';

const mapStateToProps = state => ({
  wallets: selectWallets(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      selectActiveWallet: selectActiveWalletAction,
      deleteWallet: deleteWalletAction,
    },
    dispatch
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class SelectActiveWalletContainer extends Component {
  static propTypes = {
    wallets: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Select Active Wallet',
  };

  render() {
    const { wallets, actions } = this.props;

    return (
      <SelectActiveWallet
        selectActiveWallet={actions.selectActiveWallet}
        deleteWallet={actions.deleteWallet}
        wallets={wallets}
      />
    );
  }
}
