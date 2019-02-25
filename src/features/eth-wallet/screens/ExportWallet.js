import React from 'react';
import PropTypes from 'prop-types';

import { ScreenWrapper, Text, TextInput, QRCode } from '../../../common/components';

const ExportWallet = ({ mnemonic }) => (
  <ScreenWrapper>
    <Text>Mnemonic</Text>

    <TextInput value={mnemonic} />

    <QRCode value={mnemonic} />
  </ScreenWrapper>
);

ExportWallet.propTypes = {
  mnemonic: PropTypes.string.isRequired,
};

export default ExportWallet;
