import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  ScreenWrapper,
  Text,
  ListItem,
  FlatList,
  CenterView,
  RefreshControl,
  Link,
  Radio,
} from '../../../common/components';
import { DEFAULT_TX_DIRECTION, txDirectionOptions, TX_DIRECTIONS } from '../../../common/constants';
import { getExploreTxUrl } from '../../../ethService';

import Eth from '../components/Eth';

export default class Transactions extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    txs: PropTypes.array.isRequired,
    onRefresh: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    txDirection: DEFAULT_TX_DIRECTION,
  };

  keyExtractor = ({ hash }) => hash;

  renderItem = ({
    item: { timestamp, to, from, confirmations, value, gasLimit, gasPrice, hash },
  }) => (
    <ListItem title={timestamp ? new Date(timestamp * 1000).toLocaleString() : 'Pending'}>
      <Fragment>
        <Text>To address: {to}</Text>
        <Text>From address: {from}</Text>
        <Text>Confirmations: {confirmations || 0}</Text>
        <Text>
          Amount: <Eth wei={value} />
        </Text>
        <Text>
          Gas Limit: <Eth wei={gasLimit} />
        </Text>
        <Text>
          Gas Price: <Eth wei={gasPrice} />
        </Text>
        <Text>Hash: {hash}</Text>
        <Link url={getExploreTxUrl(hash, this.props.network)} title="Explore" />
      </Fragment>
    </ListItem>
  );

  filterTxs = () => {
    const { address, txs } = this.props;
    const { txDirection } = this.state;

    const addr = address.toLowerCase();

    return txs.filter(
      (tx) => addr === tx[txDirection === TX_DIRECTIONS.RECEIVED ? 'to' : 'from'].toLowerCase()
    );
  };

  render() {
    const { isLoading, onRefresh } = this.props;
    const { txDirection } = this.state;

    const filteredTxs = this.filterTxs();

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
