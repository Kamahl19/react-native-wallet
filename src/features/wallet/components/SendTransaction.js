import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createForm } from '../../../common/services/Form';
import rules from '../../../common/rules';
import {
  ScrollView,
  Text,
  ScreenWrapper,
  Button,
  FormItem,
  TextInput,
} from '../../../common/components';

// TODO validate address, amount, feePerKb
// TODO recommend best fee
// accept amount in btc, bits, satoshi

@createForm()
export default class SendTransaction extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  handleSendTransaction = () => {
    const { form, onSubmit } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  render() {
    const { disabled, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Text>Send Transaction</Text>

          <FormItem>
            {getFieldDecorator('address', { rules: [rules.required] })(
              <TextInput label="Address" autoFocus autoCorrect={false} />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('amount', { rules: [rules.required] })(<TextInput label="Amount" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('feePerKb', { rules: [rules.required] })(
              <TextInput label="Fee Per Kb" autoCorrect={false} />
            )}
          </FormItem>

          <FormItem>{getFieldDecorator('note')(<TextInput label="note" multiline />)}</FormItem>

          <Button
            onPress={this.handleSendTransaction}
            title="Send"
            type="primary"
            size="md"
            disabled={disabled}
          />
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
