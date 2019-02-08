import React from 'react';
import { Picker, View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { getColor } from '../utils/color';

const OnePicker = ({ children, label, ...rest }) => (
  <View style={styles.container}>
    {label && <Text style={styles.label}>{label}: </Text>}
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
    flexDirection: 'row',
  },
  label: {
    alignSelf: 'center',
    fontSize: 18,
    marginRight: 12,
    color: getColor('darkGray'),
  },
  picker: {
    flexGrow: 1,
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
});
