import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import {
  ScreenWrapper,
  Button,
  Heading,
  CenterView,
  View,
  Text,
  TextInput,
} from '../../../common/components';

export default class ExportWallet extends Component {
  static propTypes = {
    mnemonic: PropTypes.string.isRequired,
    exported: PropTypes.string,
    exportWallet: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  render() {
    const { mnemonic, exported, exportWallet, isLoading } = this.props;

    return (
      <ScreenWrapper>
        <Heading>Backup Wallet</Heading>

        <View>
          <Text>Mnemonic</Text>
          <TextInput value={mnemonic} />
        </View>

        <CenterView>
          <QRCode value={mnemonic} />
        </CenterView>

        <Heading notFirst>Export Wallet</Heading>

        <Button disabled={isLoading} title="Export Wallet" onPress={exportWallet} />

        {exported && (
          <View>
            <Text>Wallet.dat</Text>
            <TextInput multiline value={exported} />
          </View>
        )}
      </ScreenWrapper>
    );
  }
}
