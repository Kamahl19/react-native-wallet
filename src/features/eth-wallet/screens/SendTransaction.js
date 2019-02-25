import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import createForm from '../../../common/services/Form';
import rules from '../../../common/rules';
import { ScreenWrapper, Button, FormItem, TextInput, Text } from '../../../common/components';
import { parseEther } from '../../../ethService';

import Usd from '../components/Usd';

class SendTransaction extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    price: PropTypes.number,
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

  getInputWei = () => {
    let ether = 0;

    try {
      ether = parseEther(this.props.form.getFieldValue('amount'));
    } catch (err) {}

    return ether;
  };

  render() {
    const { form, isLoading, price } = this.props;

    return (
      <ScreenWrapper>
        <FormItem label="Address">
          {form.getFieldDecorator('address', { rules: [rules.required] })(
            <TextInput autoCapitalize="none" autoCorrect={false} />
          )}
        </FormItem>

        <FormItem label="Amount ETH" style={styles.spacingTop}>
          {form.getFieldDecorator('amount', { rules: [rules.required] })(
            <TextInput keyboardType="numeric" />
          )}
        </FormItem>
        <Text>
          <Usd price={price} wei={this.getInputWei()} />
        </Text>

        <Button
          onPress={this.handleSendTransaction}
          title="Submit"
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
