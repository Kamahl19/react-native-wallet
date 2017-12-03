import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, Button, FormItem } from '../../../common/components';
import { createForm } from '../../../common/services/Form';
import { EmailInput } from './inputs';
import rules from '../../../common/rules';
import styles from './styles';

@createForm()
export default class ForgottenPassword extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
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
    const { getFieldDecorator } = this.props.form;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Forgotten Password</Text>

        <FormItem>
          {getFieldDecorator('email', { rules: [rules.required, rules.email] })(
            <EmailInput autoFocus />
          )}
        </FormItem>

        <View style={styles.button}>
          <Button onPress={this.handleSubmit} title="Submit" size="lg" type="primary" />
        </View>
      </ScrollView>
    );
  }
}
