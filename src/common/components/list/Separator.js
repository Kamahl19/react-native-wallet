import React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../';

export default () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
  },
});
