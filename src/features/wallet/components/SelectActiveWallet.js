import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import {
  Text,
  ScreenWrapper,
  TouchableItem,
  Heading,
  List,
  ListItem,
} from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_NETWORK } from '../constants';

export default class SelectActiveWallet extends Component {
  static propTypes = {
    selectActiveWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
  };

  getWallets = () => this.props.wallets.filter(({ network }) => network === this.state.network);

  keyExtractor = wallet => wallet.walletId;

  onPressItem = walletId => {
    this.props.selectActiveWallet(walletId);
  };

  renderItem = ({ item }) => <WalletItem wallet={item} onPressItem={this.onPressItem} />;

  render() {
    const { network } = this.state;

    const wallets = this.getWallets();

    return (
      <ScreenWrapper>
        <Heading>Select Active Wallet</Heading>

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        {wallets.length > 0 && (
          <List
            data={wallets}
            extraData={this.state.network}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        )}

        {wallets.length === 0 && <Text>No wallets</Text>}
      </ScreenWrapper>
    );
  }
}

const WalletItem = ({ wallet, onPressItem }) => (
  <ListItem
    content={
      <TouchableItem onPress={() => onPressItem(wallet.walletId)}>
        <Text style={styles.walletName}>{wallet.walletName}</Text>
      </TouchableItem>
    }
  />
);

WalletItem.propTypes = {
  wallet: PropTypes.object.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  walletName: {
    fontSize: 16,
    paddingVertical: 12,
  },
});
