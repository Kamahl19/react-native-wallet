import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createForm } from '../../../common/services/Form';
import rules from '../../../common/rules';
import { ScreenWrapper, Button, FormItem, TextInput, Heading } from '../../../common/components';
import CoinSelect from './CoinSelect';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_COIN, DEFAULT_NETWORK } from '../constants';

@createForm()
export default class CreateWallet extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    coin: DEFAULT_COIN,
    network: DEFAULT_NETWORK,
  };

  handleCreateWallet = () => {
    const { form, onSubmit } = this.props;
    const { coin, network } = this.state;

    form.validateFields((err, values) => {
      if (!err) {
        onSubmit({
          ...values,
          coin,
          network,
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { coin, network } = this.state;

    return (
      <ScreenWrapper>
        <Heading>Create Wallet</Heading>

        <CoinSelect onChange={coin => this.setState({ coin })} value={coin} />

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        <FormItem>
          {form.getFieldDecorator('walletName', { rules: [rules.required] })(
            <TextInput label="Wallet Name" autoFocus autoCorrect={false} />
          )}
        </FormItem>

        <Button onPress={this.handleCreateWallet} title="Create Wallet" type="primary" size="md" />
      </ScreenWrapper>
    );
  }
}
