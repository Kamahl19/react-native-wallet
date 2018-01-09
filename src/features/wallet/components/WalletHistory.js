import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  ScrollView,
  ScreenWrapper,
  Button,
  Heading,
  Text,
  View,
  List,
} from '../../../common/components';
import { formatSat, getExploreAddressUrl, getExploreTxUrl } from '../btcUtils';

export default class WalletHistory extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
  };

  addressKeyExtractor = address => address.address;

  txKeyExtractor = tx => tx.txid;

  exploreAddress = address => {
    Linking.openURL(getExploreAddressUrl(address.address, this.props.activeWallet.network)).catch(
      err => console.error('An error occurred', err)
    );
  };

  exploreTx = tx => {
    Linking.openURL(getExploreTxUrl(tx.txid, this.props.activeWallet.network)).catch(err =>
      console.error('An error occurred', err)
    );
  };

  renderAddress = ({ item }) => <AddressItem address={item} onExplorePress={this.exploreAddress} />;

  renderTx = ({ item }) => <TxItem tx={item} onExplorePress={this.exploreTx} />;

  render() {
    const { activeWallet } = this.props;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Addresses</Heading>
          {activeWallet.addresses &&
            activeWallet.addresses.length > 0 && (
              <List
                data={activeWallet.addresses}
                keyExtractor={this.addressKeyExtractor}
                renderItem={this.renderAddress}
              />
            )}

          {activeWallet.addresses &&
            activeWallet.addresses.length === 0 && <Text>No addresses</Text>}

          <Heading notFirst>Transactions History</Heading>
          {activeWallet.txs &&
            activeWallet.txs.length > 0 && (
              <List
                data={activeWallet.txs}
                keyExtractor={this.txKeyExtractor}
                renderItem={this.renderTx}
              />
            )}

          {activeWallet.txs && activeWallet.txs.length === 0 && <Text>No transactions</Text>}
        </ScreenWrapper>
      </ScrollView>
    );
  }
}

const AddressItem = ({ address, onExplorePress }) => (
  <View style={styles.item}>
    <Text>{address.address}</Text>
    <Button
      onPress={() => onExplorePress(address)}
      title="Explore"
      type="default"
      size="sm"
      style={styles.button}
    />
  </View>
);

AddressItem.propTypes = {
  address: PropTypes.object.isRequired,
  onExplorePress: PropTypes.func.isRequired,
};

const TxItem = ({ tx, onExplorePress }) => (
  <View style={styles.item}>
    <Text>Type: {tx.action}</Text>
    <Text>Amount: {formatSat(tx.amount)}</Text>
    <Text>Date: {moment(tx.time * 1000).format('MM/DD/YYYY')}</Text>
    <Text>Confirmations: {tx.confirmations || 0}</Text>
    <Text>Fee: {formatSat(tx.fees)}</Text>
    {tx.message && <Text>Message: {tx.message}</Text>}
    <Button
      onPress={() => onExplorePress(tx)}
      title="Explore"
      type="default"
      size="sm"
      style={styles.button}
    />
  </View>
);

TxItem.propTypes = {
  tx: PropTypes.object.isRequired,
  onExplorePress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
});
