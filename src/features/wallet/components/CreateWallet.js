import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createForm } from '../../../common/services/Form';
import rules from '../../../common/rules';
import { ScreenWrapper, Button, FormItem, TextInput, Heading } from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_NETWORK } from '../constants';

@createForm()
export default class CreateWallet extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
  };

  handleCreateWallet = () => {
    const { form, onSubmit } = this.props;
    const { network } = this.state;

    form.validateFields((err, values) => {
      if (!err) {
        onSubmit({
          ...values,
          network,
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { network } = this.state;

    return (
      <ScreenWrapper>
        <Heading>Create Wallet</Heading>

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        <FormItem>
          {form.getFieldDecorator('walletName', { rules: [rules.required] })(
            <TextInput label="Wallet Name" autoCorrect={false} />
          )}
        </FormItem>

        <Button onPress={this.handleCreateWallet} title="Create Wallet" type="primary" size="md" />
      </ScreenWrapper>
    );
  }
}
