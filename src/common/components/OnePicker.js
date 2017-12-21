import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { Picker } from './';

const OnePicker = ({ children, ...rest }) => (
  <Picker style={styles.picker} itemStyle={styles.pickerItem} {...rest}>
    {children}
  </Picker>
);

OnePicker.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OnePicker;

const styles = StyleSheet.create({
  picker: {
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
});
