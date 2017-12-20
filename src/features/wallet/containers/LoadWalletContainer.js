import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchWalletsActions, loadWalletAction, selectWallets } from '../ducks';
import LoadWallet from '../components/LoadWallet';

const mapStateToProps = state => ({
  wallets: selectWallets(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      loadWallet: loadWalletAction,
      fetchWallets: fetchWalletsActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class LoadWalletContainer extends Component {
  static propTypes = {
    wallets: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Load Wallet',
  };

  componentDidMount() {
    this.props.actions.fetchWallets();
  }

  render() {
    const { wallets, actions } = this.props;

    return <LoadWallet loadWallet={actions.loadWallet} wallets={wallets} />;
  }
}
