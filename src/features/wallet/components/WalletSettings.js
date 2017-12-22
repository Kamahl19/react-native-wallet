import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, ScreenWrapper, Button, Heading, Text } from '../../../common/components';
import { formatAmount } from '../bitcoreUtils';

export default class WalletSettings extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    onCopy: PropTypes.func.isRequired,
  };

  render() {
    const { activeWallet, onCopy } = this.props;
    const { mnemonic, balance, addresses, coin } = activeWallet;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Mnemonic</Heading>
          <Text>{mnemonic}</Text>

          <Button
            onPress={() => onCopy(mnemonic)}
            title="Copy to Clipboard"
            type="default"
            size="md"
          />

          <Heading>Balance</Heading>
          {balance && <Text>{formatAmount(balance.totalAmount, coin)}</Text>}

          <Heading>Addresses</Heading>
          {addresses &&
            addresses.map(address => <Text key={address.address}>{address.address}</Text>)}
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
