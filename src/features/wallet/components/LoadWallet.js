import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, ScreenWrapper, TouchableItem } from '../../../common/components';
import CoinSelect from './CoinSelect';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_COIN, DEFAULT_NETWORK } from '../constants';

export default class LoadWallet extends Component {
  static propTypes = {
    loadWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  };

  state = {
    coin: DEFAULT_COIN,
    network: DEFAULT_NETWORK,
  };

  getWallets = () =>
    this.props.wallets.filter(
      ({ network, coin }) => network === this.state.network && coin === this.state.coin
    );

  render() {
    const { loadWallet } = this.props;
    const { coin, network } = this.state;

    const wallets = this.getWallets();

    return (
      <ScreenWrapper>
        <Text>Load Wallet</Text>

        <CoinSelect onChange={coin => this.setState({ coin })} value={coin} />

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        {wallets.map(wallet => (
          <TouchableItem onPress={() => loadWallet(wallet.walletId)} key={wallet.walletId}>
            <Text>{wallet.walletName}</Text>
          </TouchableItem>
        ))}

        {wallets.length === 0 && <Text>No wallets</Text>}
      </ScreenWrapper>
    );
  }
}
