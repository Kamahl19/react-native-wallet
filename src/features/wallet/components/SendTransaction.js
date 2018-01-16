import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { createForm } from '../../../common/services/Form';
import rules from '../../../common/rules';
import {
  ScreenWrapper,
  Button,
  FormItem,
  TextInput,
  Heading,
  Scanner,
} from '../../../common/components';
import FeeLevelSelect from './FeeLevelSelect';
import { DEFAULT_FEE_LEVEL } from '../constants';
import { parseBitcoinInput, bitcoinToUsd } from '../../../btcService';

@createForm()
export default class SendTransaction extends Component {
  static propTypes = {
    price: PropTypes.number,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
  };

  state = {
    feeLevel: DEFAULT_FEE_LEVEL,
    showScanner: false,
  };

  toggleQRCodeScanner = () => {
    this.setState({ showScanner: !this.state.showScanner });
  };

  onQRCodeRead = e => {
    this.props.form.setFieldsValue({ address: e.data });
    this.toggleQRCodeScanner();
  };

  handleSendTransaction = () => {
    const { form, onSubmit } = this.props;
    const { feeLevel } = this.state;

    form.validateFields((err, values) => {
      if (!err) {
        onSubmit({
          ...values,
          feeLevel,
        });
      }
    });
  };

  getAmountInUsd = () => {
    const { form, price } = this.props;

    let bitcoins = 0;

    try {
      bitcoins = parseBitcoinInput(form.getFieldValue('amount'));
    } catch (err) {}

    return bitcoinToUsd(bitcoins, price);
  };

  render() {
    const { form, isLoading } = this.props;
    const { feeLevel, showScanner } = this.state;

    const amountUsd = this.getAmountInUsd();

    return (
      <ScreenWrapper>
        <Heading>Send Transaction</Heading>

        <FormItem>
          {form.getFieldDecorator('address', { rules: [rules.required] })(
            <TextInput label="Address" autoCorrect={false} autoCapitalize="none" />
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

        <FormItem>
          {form.getFieldDecorator('amount', { rules: [rules.required] })(
            <TextInput
              label="Amount BTC"
              keyboardType="numeric"
              suffix={!!amountUsd ? `$${amountUsd.toFixed(2)}` : undefined}
            />
          )}
        </FormItem>

        <FeeLevelSelect onChange={feeLevel => this.setState({ feeLevel })} value={feeLevel} />

        <Button
          onPress={this.handleSendTransaction}
          title="Send"
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
  button: {
    marginTop: 12,
  },
  scanButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
});
