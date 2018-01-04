import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createForm } from '../../../common/services/Form';
import {
  ScrollView,
  ScreenWrapper,
  Button,
  Heading,
  FormItem,
  TextInput,
} from '../../../common/components';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_COIN, DEFAULT_NETWORK } from '../constants';

@createForm()
export default class ImportWallet extends Component {
  static propTypes = {
    importWallet: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  };

  state = {
    network: DEFAULT_NETWORK,
  };

  importFromMnemonic = () => {
    const { form, importWallet } = this.props;
    const { network } = this.state;

    form.validateFields((err, { mnemonic }) => {
      if (!err) {
        importWallet({
          mnemonic,
          coin: DEFAULT_COIN,
          network,
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { network } = this.state;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading notFirst>Import Wallet from Mnemonic</Heading>
          <FormItem>
            {form.getFieldDecorator('mnemonic')(
              <TextInput label="Mnemonic" autoCorrect={false} autoCapitalize="none" autoFocus />
            )}
          </FormItem>
          <NetworkSelect onChange={network => this.setState({ network })} value={network} />
          <Button onPress={this.importFromMnemonic} title="Import" type="default" size="md" />
        </ScreenWrapper>
      </ScrollView>
    );
  }
}
