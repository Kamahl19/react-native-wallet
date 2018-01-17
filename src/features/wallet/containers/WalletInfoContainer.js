import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectActiveWallet } from '../ducks';
import WalletInfo from '../components/WalletInfo';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  wallet: selectActiveWallet(state),
});

@connect(mapStateToProps)
export default class WalletInfoContainer extends Component {
  static propTypes = {
    wallet: PropTypes.object,
  };

  static navigationOptions = {
    title: 'Wallet Info',
  };

  render() {
    const { wallet } = this.props;

    if (!wallet) {
      return <NoActiveWallet />;
    }

    return <WalletInfo wallet={wallet} />;
  }
}
