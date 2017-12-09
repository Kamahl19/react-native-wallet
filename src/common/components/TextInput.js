import React, { Component } from 'react';
import { TextField } from 'react-native-material-textfield';

import { getColor } from '../utils/color';

export default class TextInput extends Component {
  render() {
    return (
      <TextField
        textColor={getColor('darkGray')}
        tintColor={getColor('blue')}
        errorColor={getColor('red')}
        {...this.props}
      />
    );
  }
}
