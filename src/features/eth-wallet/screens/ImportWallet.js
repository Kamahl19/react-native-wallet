import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createForm from '../../../common/services/Form';
import { ScreenWrapper, Button, FormItem, TextInput, Radio } from '../../../common/components';
import rules from '../../../common/rules';

import { DEFAULT_NETWORK, networkOptions } from '../constants';

class ImportWallet extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
  };

  handleImport = () => {
    const { form, onSubmit } = this.props;
    const { network } = this.state;

    form.validateFields((err, { walletName, mnemonic }) => {
      if (!err) {
        onSubmit({
          network,
          walletName,
          mnemonic,
        });
      }
    });
  };

  render() {
    const { form, isLoading } = this.props;
    const { network } = this.state;

    return (
      <ScreenWrapper>
        <Radio
          options={networkOptions}
          value={network}
          onChange={network => this.setState({ network })}
        />

        <FormItem label="Wallet Name">
          {form.getFieldDecorator('walletName', { rules: [rules.required] })(
            <TextInput autoCorrect={false} />
          )}
        </FormItem>

        <FormItem label="Mnemonic">
          {form.getFieldDecorator('mnemonic')(
            <TextInput autoCapitalize="none" autoCorrect={false} />
          )}
        </FormItem>

        <Button onPress={this.handleImport} title="Restore" disabled={isLoading} />
      </ScreenWrapper>
    );
  }
}

export default createForm()(ImportWallet);
