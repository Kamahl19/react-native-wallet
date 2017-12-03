import React from 'react';
import { TextField } from 'react-native-material-textfield';

import { getColor } from '../utils/color';

export default function TextInput(props) {
  return (
    <TextField
      textColor={getColor('darkGray')}
      tintColor={getColor('blue')}
      errorColor={getColor('red')}
      {...props}
    />
  );
}
