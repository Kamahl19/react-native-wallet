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
  ScrollView,
  Heading,
  Scanner,
} from '../../../common/components';
import FeeLevelSelect from './FeeLevelSelect';
import { DEFAULT_FEE_LEVEL } from '../constants';

@createForm()
export default class SendTransaction extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
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

  render() {
    const { form } = this.props;
    const { feeLevel, showScanner } = this.state;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Send Transaction</Heading>

          <FormItem>
            {form.getFieldDecorator('address', { rules: [rules.required] })(
              <TextInput label="Address" autoCorrect={false} />
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
              <TextInput label="Amount BTC" keyboardType="numeric" />
            )}
          </FormItem>

          <FeeLevelSelect onChange={feeLevel => this.setState({ feeLevel })} value={feeLevel} />

          <Button
            onPress={this.handleSendTransaction}
            title="Send"
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
  button: {
    marginTop: 12,
  },
  scanButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
});
