import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import {
  ScreenWrapper,
  Button,
  Heading,
  CenterView,
  Text,
  TextInput,
} from '../../../common/components';

const ExportWallet = ({ mnemonic, exported, exportWallet, isLoading }) => (
  <ScreenWrapper>
    <Heading>Backup Wallet</Heading>

    <Fragment>
      <Text>Mnemonic</Text>
      <TextInput value={mnemonic} />
    </Fragment>

    <CenterView>
      <QRCode value={mnemonic} />
    </CenterView>

    <Heading notFirst>Export Wallet</Heading>

    <Button disabled={isLoading} title="Export Wallet" onPress={exportWallet} />

    {exported && (
      <Fragment>
        <Text>Wallet.dat</Text>
        <TextInput multiline value={exported} />
      </Fragment>
    )}
  </ScreenWrapper>
);

ExportWallet.propTypes = {
  mnemonic: PropTypes.string.isRequired,
  exported: PropTypes.string,
  exportWallet: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ExportWallet;
