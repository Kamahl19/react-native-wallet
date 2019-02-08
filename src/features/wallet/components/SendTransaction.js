import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import createForm from '../../../common/services/Form';
import rules from '../../../common/rules';
import {
  ScreenWrapper,
  Button,
  FormItem,
  TextInput,
  Heading,
  Scanner,
  Text,
} from '../../../common/components';
import FeeLevelSelect from './FeeLevelSelect';
import { DEFAULT_FEE_LEVEL } from '../constants';
import {
  parseBitcoinInput,
  bitcoinToUsd,
  satoshiToBitcoin,
  bip21Decode,
} from '../../../btcService';

class SendTransaction extends Component {
  static propTypes = {
    price: PropTypes.number,
    calculatedFee: PropTypes.number,
    confirmed: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
  };

  state = {
    feeLevel: DEFAULT_FEE_LEVEL,
    showScanner: false,
  };

  onFeeLevelChange = feeLevel => {
    this.setState({ feeLevel });
    this.props.onInputChange();
  };

  toggleQRCodeScanner = () => {
    this.setState({ showScanner: !this.state.showScanner });
  };

  onQRCodeRead = e => {
    const { address } = bip21Decode(e.data);

    this.props.form.setFieldsValue({ address });
    this.props.onInputChange();
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
    const { form, isLoading, onInputChange, calculatedFee, confirmed } = this.props;
    const { feeLevel, showScanner } = this.state;

    const amountUsd = this.getAmountInUsd();

    return (
      <ScreenWrapper>
        <Heading>Send Transaction</Heading>

        <FormItem label="Address">
          {form.getFieldDecorator('address', { rules: [rules.required] })(
            <TextInput autoCapitalize="none" autoCorrect={false} onChange={onInputChange} />
          )}
        </FormItem>

        <Button
          onPress={this.toggleQRCodeScanner}
          title={showScanner ? 'Hide scanner' : 'Scan QRCode'}
          style={styles.scanButton}
        />

        {showScanner && <Scanner onRead={this.onQRCodeRead} />}

        <FormItem label="Amount BTC">
          {form.getFieldDecorator('amount', { rules: [rules.required] })(
            <TextInput keyboardType="numeric" onChange={onInputChange} />
          )}
        </FormItem>
        <Text style={styles.usd}>${amountUsd.toFixed(2)}</Text>

        <FeeLevelSelect onChange={this.onFeeLevelChange} value={feeLevel} />

        {calculatedFee && (
          <Text style={styles.fee}>Transaction Fee: {satoshiToBitcoin(calculatedFee)} BTC</Text>
        )}

        <Button
          onPress={this.handleSendTransaction}
          title={confirmed ? 'Send' : 'Submit'}
          style={styles.button}
          disabled={isLoading}
        />
      </ScreenWrapper>
    );
  }
}

export default createForm()(SendTransaction);

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
  },
  scanButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  usd: {
    marginTop: 6,
    marginBottom: 6,
  },
  fee: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 6,
  },
});
