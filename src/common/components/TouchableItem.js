/**
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 *
 * source: https://raw.githubusercontent.com/react-community/react-navigation/master/src/views/TouchableItem.js
 */
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import { View, TouchableOpacity, TouchableNativeFeedback } from './';
import { getColor } from '../utils/color';

const ANDROID_VERSION_LOLLIPOP = 21;

export default class TouchableItem extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    delayPressIn: PropTypes.number,
    borderless: PropTypes.bool,
    pressColor: PropTypes.string,
    activeOpacity: PropTypes.number,
    children: PropTypes.node,
    style: PropTypes.any,
  };

  static defaultProps = {
    borderless: false,
    pressColor: getColor('gray'),
  };

  render() {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
      const { style, ...rest } = this.props;

      return (
        <TouchableNativeFeedback
          {...rest}
          style={null}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor || '',
            this.props.borderless || false
          )}
        >
          <View style={this.props.style}>{Children.only(this.props.children)}</View>
        </TouchableNativeFeedback>
      );
    }

    return <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>;
  }
}
