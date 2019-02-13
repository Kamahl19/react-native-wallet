import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ScreenWrapper,
  ListItem,
  Text,
  FlatList,
  CenterView,
  RefreshControl,
} from '../../../common/components';

import BtcAddressExplorer from '../components/BtcAddressExplorer';

export default class Addresses extends Component {
  static propTypes = {
    network: PropTypes.string.isRequired,
    addresses: PropTypes.array.isRequired,
    onRefresh: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  keyExtractor = ({ address }) => address;

  renderItem = ({ item: { address } }) => (
    <ListItem title={address}>
      <BtcAddressExplorer address={address} network={this.props.network} />
    </ListItem>
  );

  render() {
    const { addresses, isLoading, onRefresh } = this.props;

    return (
      <ScreenWrapper disableScroll>
        {addresses.length > 0 ? (
          <FlatList
            data={addresses}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        ) : (
          <CenterView>
            <Text>No addresses</Text>
          </CenterView>
        )}
      </ScreenWrapper>
    );
  }
}
