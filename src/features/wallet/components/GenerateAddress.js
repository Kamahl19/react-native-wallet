import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';

import {
  ScrollView,
  ScreenWrapper,
  CenterView,
  Button,
  TextInput,
  Heading,
} from '../../../common/components';

export default class GenerateAddress extends Component {
  static propTypes = {
    address: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCopy: PropTypes.func.isRequired,
  };

  render() {
    const { address, onSubmit, onCopy } = this.props;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Generate Address</Heading>

          {address && <TextInput label="Address" value={address.address} />}

          {address && (
            <Button onPress={onCopy} title="Copy to Clipboard" type="default" size="md" />
          )}

          {address && (
            <CenterView style={styles.qrCode}>
              <QRCode value={address.address} />
            </CenterView>
          )}

          <Button
            onPress={() => onSubmit()}
            title="Generate New Address"
            type="primary"
            size="md"
            style={styles.button}
          />
        </ScreenWrapper>
      </ScrollView>
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
