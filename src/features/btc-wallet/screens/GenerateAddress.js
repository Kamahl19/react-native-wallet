import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { ScreenWrapper, Button, TextInput, Text, QRCode } from '../../../common/components';
import { bip21Encode } from '../../../btcService';

const GenerateAddress = ({ address, isLoading, onSubmit }) => (
  <ScreenWrapper>
    {address && (
      <Fragment>
        <Text>Address</Text>
        <TextInput value={address.address} />
      </Fragment>
    )}

    {address && <QRCode value={bip21Encode(address.address)} />}

    <Button onPress={onSubmit} title="Generate New Address" disabled={isLoading} />
  </ScreenWrapper>
);

GenerateAddress.propTypes = {
  address: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default GenerateAddress;
