import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import Button from './Button';

const DrawerButton = ({ onPress }) => (
  <Button color="black" style={styles.component} title="☰" onPress={onPress} />
);

DrawerButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default DrawerButton;

const styles = StyleSheet.create({
  component: {
    backgroundColor: 'transparent',
  },
});
