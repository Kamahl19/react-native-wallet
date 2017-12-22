import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { View } from './';

const ScreenWrapper = ({ children }) => <View style={styles.component}>{children}</View>;

ScreenWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: 10,
  },
});
