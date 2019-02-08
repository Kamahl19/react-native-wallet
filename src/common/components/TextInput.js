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
    borderBottomColor: getColor('lightGray'),
    borderBottomWidth: 1,
    marginBottom: 6,
  },
});
