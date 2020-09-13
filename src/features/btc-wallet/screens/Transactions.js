import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  ScreenWrapper,
  Text,
  ListItem,
  FlatList,
  CenterView,
  Link,
  RefreshControl,
  Radio,
} from '../../../common/components';
import { DEFAULT_TX_DIRECTION, txDirectionOptions } from '../../../common/constants';
import { getTxConfirmationStatus, getTxDateTime, getExploreTxUrl } from '../../../btcService';

import Btc from '../components/Btc';

export default class Transactions extends Component {
  static propTypes = {
    network: PropTypes.string.isRequired,
    txs: PropTypes.array.isRequired,
    onRefresh: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    txDirection: DEFAULT_TX_DIRECTION,
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
          <Link url={getExploreTxUrl(tx.txid, this.props.network)} title="Explore" />
        </Fragment>
      </ListItem>
    );
  };

  render() {
    const { txs, isLoading, onRefresh } = this.props;
    const { txDirection } = this.state;

    const filteredTxs = txs.filter((tx) => tx.action === txDirection);

    return (
      <ScreenWrapper disableScroll>
        <Radio
          options={txDirectionOptions}
          value={txDirection}
          onChange={(txDirection) => this.setState({ txDirection })}
        />

        {filteredTxs.length > 0 ? (
          <FlatList
            data={filteredTxs}
            extraData={txDirection}
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
