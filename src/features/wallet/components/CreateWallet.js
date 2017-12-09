import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RadioForm from 'react-native-simple-radio-button';

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
import { coinOptions, networkOptions } from '../walletUtils.js';

@createForm()
export default class CreateWallet extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    coin: 'btc',
    network: 'testnet',
  };

  handleCreateWallet = () => {
    const { form, onSubmit } = this.props;
    const { coin, network } = this.state;

    form.validateFields((err, { walletName, password }) => {
      if (!err) {
        onSubmit({
          walletName,
          password,
          coin,
          network,
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Text>Create Wallet</Text>
          <RadioForm
            radio_props={coinOptions}
            initial={0}
            onPress={coin => this.setState({ coin })}
            formHorizontal
          />
          <RadioForm
            radio_props={networkOptions}
            initial={0}
            onPress={network => this.setState({ network })}
            formHorizontal
          />
          <FormItem>
            {getFieldDecorator('walletName', { rules: [rules.required] })(
              <TextInput label="Wallet Name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('password', { rules: [rules.required] })(
              <TextInput label="Password" secureTextEntry />
            )}
          </FormItem>
          <Button
            onPress={this.handleCreateWallet}
            title="Create Wallet"
            type="primary"
            size="md"
          />
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
