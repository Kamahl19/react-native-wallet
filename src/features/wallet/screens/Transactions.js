import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  ScreenWrapper,
  Text,
  ListItem,
  FlatList,
  CenterView,
  RefreshControl,
} from '../../../common/components';
import { getTxConfirmationStatus, getTxDateTime } from '../../../btcService';

import { DEFAULT_TX_ACTION } from '../constants';
import Btc from '../components/Btc';
import BtcTxExplorer from '../components/BtcTxExplorer';
import TxTypeSelect from '../components/TxTypeSelect';

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

  keyExtractor = ({ txid }) => txid;

  renderItem = ({ item: tx }) => {
    const { confirmations, status } = getTxConfirmationStatus(tx);

    return (
      <ListItem title={new Date(getTxDateTime(tx)).toLocaleString()}>
        <Fragment>
          {tx.addressTo && <Text>To address: {tx.addressTo}</Text>}
          <Text>
            Status: {status} ({confirmations} confirmations)
          </Text>
          <Text>
            Amount: <Btc satoshi={tx.amount} />
          </Text>
          <Text>
            Fee: <Btc satoshi={tx.fees} />
          </Text>
          <Text>ID: {tx.txid}</Text>
          <BtcTxExplorer network={this.props.network} txid={tx.txid} />
        </Fragment>
      </ListItem>
    );
  };

  render() {
    const { txs, isLoading, onRefresh } = this.props;
    const { txAction } = this.state;

    const filteredTxs = txs.filter(tx => tx.action === txAction);

    return (
      <ScreenWrapper disableScroll>
        <TxTypeSelect value={txAction} onChange={txAction => this.setState({ txAction })} />

        {filteredTxs.length > 0 ? (
          <FlatList
            data={filteredTxs}
            extraData={txAction}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        ) : (
          <CenterView>
            <Text>No transactions</Text>
          </CenterView>
        )}
      </ScreenWrapper>
    );
  }
}
