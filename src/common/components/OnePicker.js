import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { Picker, View, Text } from './';
import { getColor } from '../utils/color';

const OnePicker = ({ children, label, ...rest }) => (
  <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}
    <Picker style={styles.picker} itemStyle={styles.pickerItem} {...rest}>
      {children}
    </Picker>
  </View>
);

OnePicker.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
};

export default OnePicker;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  label: {
    fontSize: 12,
    paddingBottom: 8,
    color: getColor('darkGray'),
  },
  picker: {
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
});
