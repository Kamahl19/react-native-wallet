import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { Text } from './';

const Heading = ({ children, ...rest }) => (
  <Text style={styles.heading} {...rest}>
    {children}
  </Text>
);

Heading.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Heading;

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    marginBottom: 20,
  },
});
