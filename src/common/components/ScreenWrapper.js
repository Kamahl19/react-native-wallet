import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView } from 'react-native';

export default class ScreenWrapper extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    scrollEnabled: PropTypes.bool,
    fill: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled']),
    containerStyle: PropTypes.any,
    style: PropTypes.any,
  };

  static defaultProps = {
    scrollEnabled: true,
  };

  render() {
    const {
      children,
      scrollEnabled,
      fill,
      keyboardShouldPersistTaps,
      containerStyle,
      style,
    } = this.props;

    const C = scrollEnabled ? ScrollView : View;
    const passProps = {};

    if (scrollEnabled) {
      passProps.keyboardShouldPersistTaps = keyboardShouldPersistTaps || 'never';
      passProps.alwaysBounceVertical = false;
      passProps.overScrollMode = 'auto';
      passProps.contentContainerStyle = [containerStyle, fill ? styles.fillContentView : undefined];
    }

    return (
      <C {...passProps} style={[styles.component, style]}>
        {children}
      </C>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    flex: 1,
    paddingHorizontal: 10,
  },
  fillContentView: {
    minHeight: '100%',
  },
});
