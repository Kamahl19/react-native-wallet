import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput, StyleSheet } from 'react-native';

import { getColor } from '../utils/color';

export default class EnhancedTextInput extends Component {
  static propTypes = {
    style: PropTypes.any,
  };

  render() {
    const { style, ...bag } = this.props;

    return <TextInput {...bag} style={[styles.input, style]} />;
  }
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 6,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: getColor('gray'),
  },
});
