import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';

import { createForm } from '../../../common/services/Form';
import {
  ScrollView,
  ScreenWrapper,
  CenterView,
  Button,
  TextInput,
  Heading,
} from '../../../common/components';

@createForm()
export default class GenerateAddress extends Component {
  static propTypes = {
    address: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCopy: PropTypes.func.isRequired,
  };

  render() {
    const { address, onSubmit, onCopy } = this.props;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Generate Address</Heading>

          <Button onPress={() => onSubmit()} title="Generate Address" type="primary" size="md" />

          {address && <TextInput label="Address" value={address} />}

          {address && (
            <Button onPress={onCopy} title="Copy to Clipboard" type="default" size="md" />
          )}

          {address && (
            <CenterView style={{ marginTop: 20 }}>
              <QRCode value={address} />
            </CenterView>
          )}
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
