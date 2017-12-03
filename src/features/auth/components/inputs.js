import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextInput } from '../../../common/components';

export class EmailInput extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.string,
  };

  render() {
    const { value, onChangeText, ...rest } = this.props;

    return (
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        label="E-mail"
        onChangeText={onChangeText}
        value={value}
        {...rest}
      />
    );
  }
}

export class PasswordInput extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.string,
  };

  render() {
    const { value, onChangeText, ...rest } = this.props;

    return (
      <TextInput
        label="Password"
        onChangeText={onChangeText}
        secureTextEntry
        value={value}
        {...rest}
      />
    );
  }
}
