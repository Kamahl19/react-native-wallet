import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import { ScreenWrapper, Button, Heading, CenterView, TextInput } from '../../../common/components';

export default class ExportWallet extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    exportWallet: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  render() {
    const { activeWallet, exportWallet, isLoading } = this.props;
    const { mnemonic, exported } = activeWallet;

    return (
      <ScreenWrapper>
        <Heading notFirst>Backup Wallet</Heading>

        <TextInput label="Mnemonic" value={mnemonic} />

        <CenterView style={styles.qrCode}>
          <QRCode value={mnemonic} />
        </CenterView>

        <Heading notFirst>Export Wallet</Heading>

        <Button
          onPress={() => exportWallet()}
          title="Export Wallet"
          type="primary"
          size="lg"
          style={styles.button}
          disabled={isLoading}
        />

        {exported && (
          <CenterView style={styles.qrCode}>
            <QRCode value={exported} size={220} />
          </CenterView>
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
  },
  qrCode: {
    marginTop: 12,
  },
});
