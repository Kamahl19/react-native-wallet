import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, ScreenWrapper, TouchableItem, Heading } from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_COIN, DEFAULT_NETWORK } from '../constants';

export default class SelectActiveWallet extends Component {
  static propTypes = {
    selectActiveWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
  };

  getWallets = () =>
    this.props.wallets.filter(
      ({ network, coin }) => network === this.state.network && coin === DEFAULT_COIN
    );

  render() {
    const { selectActiveWallet } = this.props;
    const { network } = this.state;

    const wallets = this.getWallets();

    return (
      <ScreenWrapper>
        <Heading>Select Active Wallet</Heading>

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        {wallets.map(wallet => (
          <TouchableItem onPress={() => selectActiveWallet(wallet.walletId)} key={wallet.walletId}>
            <Text>{wallet.walletName}</Text>
          </TouchableItem>
        ))}

        {wallets.length === 0 && <Text>No wallets</Text>}
      </ScreenWrapper>
    );
  }
}
