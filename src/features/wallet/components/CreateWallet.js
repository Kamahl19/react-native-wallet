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
import CoinSelect from './CoinSelect';
import NetworkSelect from './NetworkSelect';

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

    form.validateFields((err, { name, password }) => {
      if (!err) {
        onSubmit({
          name,
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
          <CoinSelect onChange={coin => this.setState({ coin })} />
          <NetworkSelect onChange={network => this.setState({ network })} />
          <FormItem>
            {getFieldDecorator('name', { rules: [rules.required] })(
              <TextInput label="Wallet Name" autoFocus autoCorrect={false} />
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
