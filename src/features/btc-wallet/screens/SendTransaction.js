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
  Scanner,
  Text,
  View,
  Radio,
} from '../../../common/components';
import { bip21Decode } from '../../../btcService';
import { parseBitcoinInputToSatoshi } from '../../../unitsService';

import { DEFAULT_FEE_LEVEL, feeLevelOptions } from '../constants';
import Btc from '../components/Btc';
import Usd from '../components/Usd';

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

  handleFeeLevelChange = feeLevel => {
    this.setState({ feeLevel });
    this.props.onInputChange();
  };

  handleQRCodeRead = e => {
    const { address } = bip21Decode(e.data);

    this.props.form.setFieldsValue({ address });
    this.props.onInputChange();
    this.setState({ showScanner: false });
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

  getInputSatoshi = () => {
    let satoshi = 0;

    try {
      satoshi = parseBitcoinInputToSatoshi(this.props.form.getFieldValue('amount'));
    } catch (err) {}

    return satoshi;
  };

  render() {
    const { form, isLoading, onInputChange, calculatedFee, confirmed, price } = this.props;
    const { feeLevel, showScanner } = this.state;

    const amountSatoshi = this.getInputSatoshi();

    return (
      <ScreenWrapper>
        <FormItem label="Address">
          {form.getFieldDecorator('address', { rules: [rules.required] })(
            <TextInput autoCapitalize="none" autoCorrect={false} onChange={onInputChange} />
          )}
        </FormItem>

        <Button
          onPress={() => this.setState({ showScanner: !showScanner })}
          title={showScanner ? 'Hide scanner' : 'Scan QRCode'}
        />

        {showScanner && <Scanner onRead={this.handleQRCodeRead} />}

        <FormItem label="Amount BTC" style={styles.spacingTop}>
          {form.getFieldDecorator('amount', { rules: [rules.required] })(
            <TextInput keyboardType="numeric" onChange={onInputChange} />
          )}
        </FormItem>
        <Text>
          <Usd price={price} satoshi={amountSatoshi} />
        </Text>

        <Text style={styles.spacingTop}>Fee Level</Text>
        <Radio options={feeLevelOptions} value={feeLevel} onChange={this.handleFeeLevelChange} />

        {calculatedFee && (
          <View style={styles.spacingTop}>
            <Text>Calculated Fee: </Text>
            <Btc satoshi={calculatedFee} />
          </View>
        )}

        <Button
          onPress={this.handleSendTransaction}
          title={confirmed ? 'Send' : 'Submit'}
          disabled={isLoading}
          style={styles.spacingTop}
        />
      </ScreenWrapper>
    );
  }
}

export default createForm()(SendTransaction);

const styles = StyleSheet.create({
  spacingTop: {
    marginTop: 12,
  },
});
