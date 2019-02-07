import React, { Component } from 'react';
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
  View,
} from '../../../common/components';
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

        {address && (
          <View>
            <Text>Address</Text>
            <TextInput value={address.address} />
          </View>
        )}

        {address && (
          <CenterView style={styles.qrCode}>
            <QRCode value={bip21Encode(address.address)} />
          </CenterView>
        )}

        <View style={styles.button}>
          <Button disabled={isLoading} title="Generate New Address" onPress={onSubmit} />
        </View>
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
