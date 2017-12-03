import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, Button, FormItem } from '../../../common/components';
import { createForm } from '../../../common/services/Form';
import { EmailInput, PasswordInput } from './inputs';
import rules from '../../../common/rules';
import styles from './styles';

@createForm()
export default class Login extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    goToSignUp: PropTypes.func.isRequired,
    goToForgottenPassword: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  handleSubmit = () => {
    const { onSubmit, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  render() {
    const { form, goToSignUp, goToForgottenPassword } = this.props;
    const { getFieldDecorator } = form;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log In</Text>

        <FormItem>
          {getFieldDecorator('email', { rules: [rules.required, rules.email] })(
            <EmailInput autoFocus />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', { rules: [rules.required, rules.password] })(
            <PasswordInput />
          )}
        </FormItem>

        <View style={styles.button}>
          <Button block onPress={this.handleSubmit} title="Log In" size="lg" type="primary" />
        </View>

        <View style={styles.button}>
          <Button
            onPress={goToForgottenPassword}
            size="md"
            type="default"
            title="Forgot password?"
          />
          <Button onPress={goToSignUp} size="md" type="default" title="Sign Up" />
        </View>
      </ScrollView>
    );
  }
}
