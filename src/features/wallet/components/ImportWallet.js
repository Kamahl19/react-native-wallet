import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { createForm } from '../../../common/services/Form';
import {
  ScrollView,
  ScreenWrapper,
  Button,
  Heading,
  FormItem,
  TextInput,
  Scanner,
} from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_NETWORK } from '../constants';

@createForm()
export default class ImportWallet extends Component {
  static propTypes = {
    importWallet: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
    showScanner: false,
  };

  toggleQRCodeScanner = () => {
    this.setState({ showScanner: !this.state.showScanner });
  };

  onQRCodeRead = e => {
    this.props.form.setFieldsValue({ mnemonic: e.data });
    this.toggleQRCodeScanner();
  };

  importFromMnemonic = () => {
    const { form, importWallet } = this.props;
    const { network } = this.state;

    form.validateFields((err, { mnemonic }) => {
      if (!err) {
        importWallet({
          mnemonic,
          network,
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { network, showScanner } = this.state;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Import Wallet</Heading>

          <NetworkSelect onChange={network => this.setState({ network })} value={network} />

          <FormItem>
            {form.getFieldDecorator('mnemonic')(
              <TextInput label="Mnemonic" autoCorrect={false} autoCapitalize="none" />
            )}
          </FormItem>

          <Button
            onPress={this.toggleQRCodeScanner}
            title={showScanner ? 'Hide scanner' : 'Scan QRCode'}
            type="default"
            size="sm"
            style={styles.scanButton}
          />

          {showScanner && <Scanner onRead={this.onQRCodeRead} />}

          <Button onPress={this.importFromMnemonic} title="Import" type="primary" size="md" />
        </ScreenWrapper>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scanButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 12,
  },
});
