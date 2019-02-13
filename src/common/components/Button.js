import React from 'react';
import PropTypes from 'prop-types';
import { Button, View, StyleSheet } from 'react-native';

import { getColor } from '../utils/color';

const EnhancedButton = ({ color, style, ...props }) => (
  <View style={[styles.buttonContainer, style]}>
    <Button color={color || getColor('white')} {...props} />
  </View>
);

EnhancedButton.propTypes = {
  color: PropTypes.string,
  style: PropTypes.any,
};

export default EnhancedButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: getColor('blue'),
  },
});
