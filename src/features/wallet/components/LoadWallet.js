import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, Text, ScreenWrapper, TouchableItem } from '../../../common/components';
import CoinSelect from './CoinSelect';
import NetworkSelect from './NetworkSelect';

export default class LoadWallet extends Component {
  static propTypes = {
    loadWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  };

  state = {
    coin: 'btc',
    network: 'testnet',
  };

  filterWallets = ({ network, coin }) => network === this.state.network && coin === this.state.coin;

  render() {
    const { loadWallet, wallets } = this.props;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Text>Load Wallet</Text>
          <CoinSelect onChange={coin => this.setState({ coin })} />
          <NetworkSelect onChange={network => this.setState({ network })} />
          {wallets.filter(this.filterWallets).map(wallet => (
            <TouchableItem onPress={() => loadWallet(wallet.walletId)} key={wallet.walletId}>
              <Text>{wallet.walletName}</Text>
            </TouchableItem>
          ))}
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
