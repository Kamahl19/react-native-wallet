import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const ScreenWrapper = ({ children, disableScroll }) => (
  <SafeAreaView style={styles.grow}>
    <ScrollView
      alwaysBounceVertical={false}
      scrollEnabled={!disableScroll}
      contentContainerStyle={[styles.grow, styles.spacing]}
      style={styles.grow}
    >
      {children}
    </ScrollView>
  </SafeAreaView>
);

ScreenWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  disableScroll: PropTypes.bool,
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  spacing: {
    padding: 10,
  },
});
