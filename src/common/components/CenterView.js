import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

const CenterView = ({ children, style }) => (
  <View style={[styles.component, style]}>{children}</View>
);

CenterView.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.any,
};

export default CenterView;

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
