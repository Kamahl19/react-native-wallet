import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';

import {
  ScreenWrapper,
  Button,
  Heading,
  Text,
  View,
  List,
  CenterView,
  RefreshControl,
} from '../../../common/components';
import TxActionSelect from './TxActionSelect';
import { DEFAULT_TX_ACTION } from '../constants';
import {
  satoshiToBitcoin,
  getExploreTxUrl,
  getTxConfirmationStatus,
  getTxDateTime,
} from '../../../btcService';

export default class Transactions extends Component {
  static propTypes = {
    network: PropTypes.string.isRequired,
    txs: PropTypes.array.isRequired,
    onRefresh: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    txAction: DEFAULT_TX_ACTION,
  };

  keyExtractor = tx => tx.txid;

  openExplorer = tx => {
    Linking.openURL(getExploreTxUrl(tx.txid, this.props.network)).catch(err =>
      console.error('An error occurred', err)
    );
  };

  renderItem = ({ item }) => <TxItem tx={item} onExplorePress={this.openExplorer} />;

  render() {
    const { txs, isLoading, onRefresh } = this.props;
    const { txAction } = this.state;

    const filteredTxs = txs.filter(tx => tx.action === txAction);

    return (
      <ScreenWrapper scrollEnabled={false}>
        <Heading>Transactions</Heading>

        <TxActionSelect onChange={txAction => this.setState({ txAction })} value={txAction} />

        {filteredTxs.length > 0 && (
          <List
            data={filteredTxs}
            extraData={txAction}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        )}

        {filteredTxs.length === 0 && (
          <CenterView>
            <Text>No transactions</Text>
          </CenterView>
        )}
      </ScreenWrapper>
    );
  }
}

const TxItem = ({ tx, onExplorePress }) => {
  const { confirmations, status } = getTxConfirmationStatus(tx);

  return (
    <View style={styles.item}>
      {tx.addressTo && <Text>To address: {tx.addressTo}</Text>}
      <Text>
        Status: {status} ({confirmations} confirmations)
      </Text>
      <Text>Amount: {satoshiToBitcoin(tx.amount)} BTC</Text>
      <Text>Date: {getTxDateTime(tx)}</Text>
      <Text>Fee: {satoshiToBitcoin(tx.fees)} BTC</Text>
      <Text>ID: {tx.txid}</Text>
      <View style={styles.button}>
        <Button title="Explore" onPress={() => onExplorePress(tx)} />
      </View>
    </View>
  );
};

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
