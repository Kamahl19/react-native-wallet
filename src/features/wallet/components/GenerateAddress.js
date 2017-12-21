import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';

import { createForm } from '../../../common/services/Form';
import { ScrollView, Text, ScreenWrapper, Button, TextInput } from '../../../common/components';

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
          <Text>Generate Address</Text>

          <Button onPress={() => onSubmit()} title="Generate Address" type="primary" size="md" />

          {address && <TextInput label="Address" value={address} />}

          {address && (
            <Button onPress={onCopy} title="Copy to Clipboard" type="default" size="md" />
          )}

          {address && <QRCode value={address} />}
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
