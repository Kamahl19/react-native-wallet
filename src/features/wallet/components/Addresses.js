import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';

import {
  ScreenWrapper,
  Button,
  Heading,
  Text,
  View,
  FlatList,
  CenterView,
  RefreshControl,
} from '../../../common/components';
import { getExploreAddressUrl } from '../../../btcService';

export default class Addresses extends Component {
  static propTypes = {
    network: PropTypes.string.isRequired,
    addresses: PropTypes.array.isRequired,
    onRefresh: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  keyExtractor = address => address.address;

  openExplorer = address => {
    Linking.openURL(getExploreAddressUrl(address.address, this.props.network)).catch(err =>
      console.error('An error occurred', err)
    );
  };

  renderItem = ({ item }) => <AddressItem address={item} onExplorePress={this.openExplorer} />;

  render() {
    const { isLoading, onRefresh } = this.props;
    const { addresses } = this.props;

    return (
      <ScreenWrapper scrollEnabled={false}>
        <Heading>Addresses</Heading>
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

const AddressItem = ({ address, onExplorePress }) => (
  <View style={styles.item}>
    <Text>{address.address}</Text>
    <Button title="Explore" onPress={() => onExplorePress(address)} style={styles.button} />
  </View>
);

AddressItem.propTypes = {
  address: PropTypes.object.isRequired,
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
