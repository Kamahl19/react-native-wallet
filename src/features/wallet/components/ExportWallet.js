import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import {
  ScrollView,
  ScreenWrapper,
  Button,
  Heading,
  CenterView,
  TextInput,
} from '../../../common/components';

export default class ExportWallet extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    exportWallet: PropTypes.func.isRequired,
  };

  render() {
    const { activeWallet, exportWallet } = this.props;
    const { mnemonic, exported } = activeWallet;

    return (
      <ScrollView>
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
            size="md"
            style={styles.button}
          />

          {exported && (
            <CenterView style={styles.qrCode}>
              <QRCode value={exported} size={220} />
            </CenterView>
          )}
        </ScreenWrapper>
      </ScrollView>
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
