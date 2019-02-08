import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import {
  ScreenWrapper,
  CenterView,
  Button,
  TextInput,
  Heading,
  Text,
} from '../../../common/components';
import { bip21Encode } from '../../../btcService';

const GenerateAddress = ({ address, onSubmit, isLoading }) => (
  <ScreenWrapper>
    <Heading>Generate Address</Heading>

    {address && (
      <Fragment>
        <Text>Address</Text>
        <TextInput value={address.address} />
      </Fragment>
    )}

    {address && (
      <CenterView style={styles.qrCode}>
        <QRCode value={bip21Encode(address.address)} />
      </CenterView>
    )}

    <Button
      onPress={onSubmit}
      title="Generate New Address"
      style={styles.button}
      disabled={isLoading}
    />
  </ScreenWrapper>
);

GenerateAddress.propTypes = {
  address: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default GenerateAddress;

const styles = StyleSheet.create({
  qrCode: {
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
});
