import React from 'react';
import PropTypes from 'prop-types';

import { ScreenWrapper, Button, Text, TextInput, QRCode } from '../../../common/components';

const ExportWallet = ({ mnemonic, exported, exportWallet, isLoading }) => (
  <ScreenWrapper>
    <Text>Mnemonic</Text>

    <TextInput value={mnemonic} />

    <QRCode value={mnemonic} />

    <Button disabled={isLoading} title="Export Wallet as JSON" onPress={exportWallet} />

    {exported && <TextInput multiline value={exported} />}
  </ScreenWrapper>
);

ExportWallet.propTypes = {
  mnemonic: PropTypes.string.isRequired,
  exported: PropTypes.string,
  exportWallet: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ExportWallet;
