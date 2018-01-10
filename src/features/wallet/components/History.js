import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ScreenWrapper, Button, Heading, Text, View, List } from '../../../common/components';
import { formatSat, getExploreTxUrl } from '../btcUtils';

export default class History extends Component {
  static propTypes = {
    network: PropTypes.string.isRequired,
    transactions: PropTypes.array,
  };

  keyExtractor = tx => tx.txid;

  openExplorer = tx => {
    Linking.openURL(getExploreTxUrl(tx.txid, this.props.network)).catch(err =>
      console.error('An error occurred', err)
    );
  };

  renderItem = ({ item }) => <TxItem tx={item} onExplorePress={this.openExplorer} />;

  render() {
    const { transactions } = this.props;

    return (
      <ScreenWrapper scrollEnabled={false}>
        <Heading>Transactions History</Heading>
        {transactions &&
          transactions.length > 0 && (
            <List
              data={transactions}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          )}

        {transactions && transactions.length === 0 && <Text>No transactions</Text>}
      </ScreenWrapper>
    );
  }
}

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
