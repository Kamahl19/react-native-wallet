import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createForm } from '../../../common/services/Form';
import rules from '../../../common/rules';
import { ScreenWrapper, Button, FormItem, TextInput, Heading } from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_NETWORK } from '../constants';

class CreateWallet extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
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
    const { form, isLoading } = this.props;
    const { network } = this.state;

    return (
      <ScreenWrapper>
        <Heading>Create Wallet</Heading>

        <NetworkSelect onChange={network => this.setState({ network })} value={network} />

        <FormItem label="Wallet Name">
          {form.getFieldDecorator('walletName', { rules: [rules.required] })(
            <TextInput autoCorrect={false} />
          )}
        </FormItem>

        <Button disabled={isLoading} title="Create Wallet" onPress={this.handleCreateWallet} />
      </ScreenWrapper>
    );
  }
}

export default createForm()(CreateWallet);
