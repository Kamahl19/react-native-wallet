import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { createForm } from '../../../common/services/Form';
import {
  ScreenWrapper,
  Button,
  Heading,
  FormItem,
  TextInput,
  Scanner,
  Text,
} from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_NETWORK } from '../constants';

class ImportWallet extends Component {
  static propTypes = {
    importWallet: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
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

  doImport = (opts = { mnemonic: true, from3rdParty: false }) => {
    const { form, importWallet } = this.props;
    const { network } = this.state;

    form.validateFields((err, { mnemonic, walletData }) => {
      if (!err) {
        importWallet({
          walletData: opts.mnemonic ? undefined : walletData,
          mnemonic: opts.mnemonic ? mnemonic : undefined,
          network,
          from3rdParty: opts.from3rdParty,
        });
      }
    });
  };

  render() {
    const { form, isLoading } = this.props;
    const { network, showScanner } = this.state;

    return (
      <ScreenWrapper>
        <Heading>Restore Wallet</Heading>

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        <FormItem label="Mnemonic">
          {form.getFieldDecorator('mnemonic')(
            <TextInput autoCapitalize="none" autoCorrect={false} />
          )}
        </FormItem>

        <Button
          onPress={this.toggleQRCodeScanner}
          title={showScanner ? 'Hide scanner' : 'Scan QRCode'}
          style={styles.scanButton}
        />

        {showScanner && <Scanner onRead={this.onQRCodeRead} />}

        <Button
          onPress={() => this.doImport({ mnemonic: true, from3rdParty: false })}
          title="Restore"
          disabled={isLoading}
        />

        <Text style={styles.spacing}>
          NOTE: If mnemonic comes from the wallet not created via this software, please use the
          button below
        </Text>

        <Button
          onPress={() => this.doImport({ mnemonic: true, from3rdParty: true })}
          title="Import from 3rd party software"
          disabled={isLoading}
          style={styles.spacing}
        />

        <Heading notFirst>Import Wallet</Heading>

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        <FormItem label="Wallet Data">
          {form.getFieldDecorator('walletData')(
            <TextInput autoCapitalize="none" autoCorrect={false} multiline />
          )}
        </FormItem>

        <Button
          onPress={() => this.doImport({ mnemonic: false, from3rdParty: false })}
          title="Import"
          disabled={isLoading}
        />
      </ScreenWrapper>
    );
  }
}

export default createForm()(ImportWallet);

const styles = StyleSheet.create({
  scanButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 12,
  },
  spacing: {
    marginTop: 24,
  },
});
