import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import {
  Alert,
  Text,
  ScreenWrapper,
  TouchableOpacity,
  FlatList,
  CenterView,
} from '../../../common/components';

import { DEFAULT_NETWORK } from '../constants';
import NetworkSelect from '../components/NetworkSelect';

export default class SelectActiveWallet extends Component {
  static propTypes = {
    selectActiveWallet: PropTypes.func.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
  };

  handleDelete = walletId => {
    Alert.alert(
      'Do you really want to delete this wallet?',
      'Make sure you have a mnemonic or a backup of this wallet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.props.deleteWallet(walletId), style: 'destructive' },
      ]
    );
  };

  keyExtractor = ({ walletId }) => walletId;

  renderItem = ({ item: { walletId, walletName } }) => (
    <TouchableOpacity
      onPress={() => this.props.selectActiveWallet(walletId)}
      onLongPress={() => this.handleDelete(walletId)}
    >
      <Text style={styles.walletName}>{walletName}</Text>
    </TouchableOpacity>
  );

  render() {
    const { wallets } = this.props;
    const { network } = this.state;

    const filteredWallets = wallets.filter(w => w.network === network);

    return (
      <ScreenWrapper disableScroll>
        <NetworkSelect value={network} onChange={network => this.setState({ network })} />

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

const styles = StyleSheet.create({
  walletName: {
    fontSize: 16,
    paddingVertical: 12,
  },
});
