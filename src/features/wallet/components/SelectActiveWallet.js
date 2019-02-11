import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Alert } from 'react-native';

import {
  Text,
  ScreenWrapper,
  TouchableOpacity,
  Heading,
  FlatList,
  CenterView,
} from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_NETWORK } from '../constants';

export default class SelectActiveWallet extends Component {
  static propTypes = {
    selectActiveWallet: PropTypes.func.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
  };

  keyExtractor = wallet => wallet.walletId;

  onSelect = walletId => {
    this.props.selectActiveWallet(walletId);
  };

  onDelete = walletId => {
    Alert.alert(
      'Do you really want to delete this wallet?',
      'Make sure you have a mnemonic or a backup of this wallet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.props.deleteWallet(walletId), style: 'destructive' },
      ]
    );
  };

  renderItem = ({ item }) => (
    <WalletItem wallet={item} onPress={this.onSelect} onLongPress={this.onDelete} />
  );

  render() {
    const { wallets } = this.props;
    const { network } = this.state;

    const filteredWallets = wallets.filter(w => w.network === network);

    return (
      <ScreenWrapper scrollEnabled={false}>
        <Heading>Select Active Wallet</Heading>

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        {filteredWallets.length > 0 ? (
          <FlatList
            data={filteredWallets}
            extraData={network}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        ) : (
          <CenterView>
            <Text>No wallets</Text>
          </CenterView>
        )}
      </ScreenWrapper>
    );
  }
}

const WalletItem = ({ wallet, onPress, onLongPress }) => (
  <TouchableOpacity
    onPress={() => onPress(wallet.walletId)}
    onLongPress={() => onLongPress(wallet.walletId)}
  >
    <Text style={styles.walletName}>{wallet.walletName}</Text>
  </TouchableOpacity>
);

WalletItem.propTypes = {
  wallet: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  walletName: {
    fontSize: 16,
    paddingVertical: 12,
  },
});
