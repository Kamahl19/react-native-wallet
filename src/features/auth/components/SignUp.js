import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, Button, FormItem } from '../../../common/components';
import { createForm } from '../../../common/services/Form';
import { EmailInput, PasswordInput } from './inputs';
import rules from '../../../common/rules';
import styles from './styles';

@createForm()
export default class SignUp extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  handleSubmit = () => {
    const { onSubmit, form } = this.props;

    form.validateFields((err, { email, password }) => {
      if (!err) {
        onSubmit({ email, password });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <FormItem>
          {getFieldDecorator('email', { rules: [rules.required, rules.email] })(
            <EmailInput autoFocus />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: rules.passwordWithLimit,
          })(<PasswordInput />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('repeatPassword', {
            rules: rules.repeatPassword(form),
          })(<PasswordInput placeholder="Repeat Password" />)}
        </FormItem>

        <View style={styles.button}>
          <Button block onPress={this.handleSubmit} size="lg" title="Sign Up" type="primary" />
        </View>
      </ScrollView>
    );
  }
}
