import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, Text, ScreenWrapper, TouchableItem } from '../../../common/components';
import CoinSelect from './CoinSelect';
import NetworkSelect from './NetworkSelect';

export default class LoadWallet extends Component {
  static propTypes = {
    loadWallet: PropTypes.func.isRequired,
    encryptedWallets: PropTypes.array.isRequired,
  };

  state = {
    coin: 'btc',
    network: 'testnet',
  };

  filterWallets = () =>
    this.props.encryptedWallets.filter(
      ({ network, coin }) => network === this.state.network && coin === this.state.coin
    );

  render() {
    const { loadWallet } = this.props;

    const filteredWallets = this.filterWallets();

    return (
      <ScrollView>
        <ScreenWrapper>
          <Text>Load Wallet</Text>
          <CoinSelect onChange={coin => this.setState({ coin })} />
          <NetworkSelect onChange={network => this.setState({ network })} />
          {filteredWallets.map((wallet, idx) => (
            <TouchableItem onPress={() => loadWallet(wallet)} key={idx}>
              <Text>{wallet.walletName}</Text>
            </TouchableItem>
          ))}
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
