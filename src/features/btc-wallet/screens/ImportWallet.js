import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import createForm from '../../../common/services/Form';
import {
  ScreenWrapper,
  Button,
  FormItem,
  TextInput,
  Scanner,
  Text,
  Radio,
} from '../../../common/components';

import { DEFAULT_NETWORK, networkOptions } from '../constants';

class ImportWallet extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
    showScanner: false,
  };

  handleQRCodeRead = e => {
    this.props.form.setFieldsValue({ mnemonic: e.data });
    this.setState({ showScanner: false });
  };

  doImport = (opts = { mnemonic: true, from3rdParty: false }) => {
    const { form, onSubmit } = this.props;
    const { network } = this.state;

    form.validateFields((err, { mnemonic, walletData }) => {
      if (!err) {
        onSubmit({
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
        <Radio
          options={networkOptions}
          value={network}
          onChange={network => this.setState({ network })}
        />

        <FormItem label="Mnemonic">
          {form.getFieldDecorator('mnemonic')(
            <TextInput autoCapitalize="none" autoCorrect={false} />
          )}
        </FormItem>

        <Button
          onPress={() => this.setState({ showScanner: !showScanner })}
          title={showScanner ? 'Hide scanner' : 'Scan QRCode'}
        />

        {showScanner && <Scanner onRead={this.handleQRCodeRead} />}

        <Text style={styles.spacingTop}>
          If mnemonic comes from the wallet created via this software, click on button bellow
        </Text>

        <Button
          onPress={() => this.doImport({ mnemonic: true, from3rdParty: false })}
          title="Restore"
          disabled={isLoading}
        />

        <Text style={styles.spacingTop}>
          If mnemonic comes from the wallet created via different software, click on button bellow
        </Text>

        <Button
          onPress={() => this.doImport({ mnemonic: true, from3rdParty: true })}
          title="Import from 3rd party software"
          disabled={isLoading}
        />

        <FormItem label="Wallet JSON Data" style={styles.spacingTop}>
          {form.getFieldDecorator('walletData')(
            <TextInput autoCapitalize="none" autoCorrect={false} multiline />
          )}
        </FormItem>

        <Button
          onPress={() => this.doImport({ mnemonic: false, from3rdParty: false })}
          title="Import as JSON"
          disabled={isLoading}
        />
      </ScreenWrapper>
    );
  }
}

export default createForm()(ImportWallet);

const styles = StyleSheet.create({
  spacingTop: {
    marginTop: 12,
  },
});
