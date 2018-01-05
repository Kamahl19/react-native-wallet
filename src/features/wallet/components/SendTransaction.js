import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createForm } from '../../../common/services/Form';
import rules from '../../../common/rules';
import { ScreenWrapper, Button, FormItem, TextInput, Heading } from '../../../common/components';
import FeeLevelSelect from './FeeLevelSelect';
import { DEFAULT_FEE_LEVEL } from '../constants';

// TODO validate address, amount
// accept amount in btc, bits, satoshi

@createForm()
export default class SendTransaction extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    feeLevel: DEFAULT_FEE_LEVEL,
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
    const { feeLevel } = this.state;

    return (
      <ScreenWrapper>
        <Heading>Send Transaction</Heading>

        <FormItem>
          {form.getFieldDecorator('address', { rules: [rules.required] })(
            <TextInput label="Address" autoFocus autoCorrect={false} />
          )}
        </FormItem>

        <FormItem>
          {form.getFieldDecorator('amount', { rules: [rules.required] })(
            <TextInput label="Amount BTC" keyboardType="numeric" />
          )}
        </FormItem>

        <FeeLevelSelect onChange={feeLevel => this.setState({ feeLevel })} value={feeLevel} />

        <FormItem>{form.getFieldDecorator('note')(<TextInput label="Note" multiline />)}</FormItem>

        <Button onPress={this.handleSendTransaction} title="Send" type="primary" size="md" />
      </ScreenWrapper>
    );
  }
}
