import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

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
import { formatSat, getExploreTxUrl } from '../btcUtils';
import TxActionSelect from './TxActionSelect';
import { DEFAULT_TX_ACTION } from '../constants';

export default class Transactions extends Component {
  static propTypes = {
    network: PropTypes.string.isRequired,
    transactions: PropTypes.array,
    onRefresh: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    txAction: DEFAULT_TX_ACTION,
  };

  getTransactions = () =>
    this.props.transactions.filter(({ action }) => action === this.state.txAction);

  keyExtractor = tx => tx.txid;

  openExplorer = tx => {
    Linking.openURL(getExploreTxUrl(tx.txid, this.props.network)).catch(err =>
      console.error('An error occurred', err)
    );
  };

  renderItem = ({ item }) => <TxItem tx={item} onExplorePress={this.openExplorer} />;

  render() {
    const { isLoading, onRefresh } = this.props;
    const { txAction } = this.state;

    const transactions = this.getTransactions();

    return (
      <ScreenWrapper scrollEnabled={false}>
        <Heading>Transactions</Heading>

        <TxActionSelect onChange={txAction => this.setState({ txAction })} value={txAction} />

        {transactions &&
          transactions.length > 0 && (
            <List
              data={transactions}
              extraData={txAction}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
            />
          )}

        {transactions &&
          transactions.length === 0 && (
            <CenterView>
              <Text>No transactions</Text>
            </CenterView>
          )}
      </ScreenWrapper>
    );
  }
}

const TxItem = ({ tx, onExplorePress }) => (
  <View style={styles.item}>
    {tx.addressTo && <Text>To address: {tx.addressTo}</Text>}
    <Text>
      Status: {tx.confirmations && tx.confirmations >= 6 ? 'Confirmed' : 'Unconfirmed'} ({tx.confirmations ||
        0}{' '}
      confirmations)
    </Text>
    <Text>Amount: {formatSat(tx.amount)}</Text>
    <Text>Date: {moment((tx.createdOn || tx.time) * 1000).format('MM/DD/YYYY hh:mm A')}</Text>
    <Text>Fee: {formatSat(tx.fees)}</Text>
    <Text>ID: {tx.txid}</Text>
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
