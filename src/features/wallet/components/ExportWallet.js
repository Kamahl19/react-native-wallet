import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import {
  ScreenWrapper,
  // Button,
  Heading,
  CenterView,
  TextInput,
  // Text,
} from '../../../common/components';

export default class ExportWallet extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    exportWallet: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  render() {
    const { activeWallet } = this.props;
    // const {  exportWallet, isLoading } = this.props;
    const { mnemonic } = activeWallet;
    // const { exported } = activeWallet;

    return (
      <ScreenWrapper>
        <Heading notFirst>Backup Wallet</Heading>

        <TextInput label="Mnemonic" value={mnemonic} />

        <CenterView>
          <QRCode value={mnemonic} />
        </CenterView>

        {/* TODO exporting the whole Wallet.dat file is possible but confusing for user and not needed currently */}
        {/* <Heading notFirst>Export Wallet</Heading>

        <Button
          onPress={() => exportWallet()}
          title="Export Wallet"
          type="primary"
          size="lg"
          disabled={isLoading}
        />

        {exported && (
          <CenterView>
            <QRCode value={exported} size={220} />
          </CenterView>
        )} */}
      </ScreenWrapper>
    );
  }
}
