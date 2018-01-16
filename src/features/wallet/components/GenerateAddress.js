import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import { ScreenWrapper, CenterView, Button, TextInput, Heading } from '../../../common/components';
import { bip21Encode } from '../../../btcService';

export default class GenerateAddress extends Component {
  static propTypes = {
    address: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  render() {
    const { address, onSubmit, isLoading } = this.props;

    return (
      <ScreenWrapper>
        <Heading>Generate Address</Heading>

        {address && <TextInput label="Address" value={address.address} />}

        {address && (
          <CenterView style={styles.qrCode}>
            <QRCode value={bip21Encode(address.address)} />
          </CenterView>
        )}

        <Button
          onPress={() => onSubmit()}
          title="Generate New Address"
          type="primary"
          size="lg"
          style={styles.button}
          disabled={isLoading}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  qrCode: {
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
});
