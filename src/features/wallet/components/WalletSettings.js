import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../../spinner';
import {
  ScrollView,
  ScreenWrapper,
  Button,
  TextInput,
  Heading,
  Text,
} from '../../../common/components';
import { formatAmount } from '../bitcoreUtils';

export default class WalletSettings extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    isGettingBalance: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
  };

  render() {
    const { activeWallet, isGettingBalance, onCopy } = this.props;
    const { mnemonic, balance, coin } = activeWallet;

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

          <Spinner show={isGettingBalance}>
            <Heading>Balance</Heading>
            {balance && <Text>{formatAmount(balance, coin)}</Text>}
          </Spinner>
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
