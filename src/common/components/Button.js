import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';

import { Text, TouchableItem, TouchableNativeFeedback, View } from './';
import { css } from '../utils/style';
import { getColor } from '../utils/color';

const HIT_SLOP = {
  top: 6,
  right: 6,
  bottom: 6,
  left: 6,
};

export default class Button extends Component {
  static propTypes = {
    block: PropTypes.bool,
    disabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']).isRequired,
    style: PropTypes.any,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['default', 'primary']).isRequired,
  };

  id = `button-${Math.random()}`;

  render() {
    const { block, disabled, onPress, size, style, title, type } = this.props;

    const activeSizeStyle = sizeStyles[size];
    const activeTypeStyle = typeStyles[type];

    return (
      <TouchableItem
        disabled={disabled}
        hitSlop={HIT_SLOP}
        key={`${this.id}-${disabled ? 'disabled' : 'enabled'}`}
        onPress={onPress}
        pressColor={getColor('white')}
        style={[
          css('opacity', disabled ? 0.5 : 1),
          activeTypeStyle.view,
          styles.touchableWrapper,
          style,
          block ? { width: '100%' } : undefined,
        ]}
        useForeground={Platform.select({
          ios: () => false,
          android: TouchableNativeFeedback.canUseNativeForeground,
        })()}
      >
        <View style={[styles.button, activeSizeStyle.button]}>
          <Text style={[styles.title, activeSizeStyle.title, activeTypeStyle.title]}>{title}</Text>
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  touchableWrapper: {
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontWeight: '500',
    transform: [{ translateY: -1 }],
  },
});

const typeStyles = {
  default: StyleSheet.create({
    view: {
      backgroundColor: getColor('lightGray'),
    },
    title: {
      color: getColor('darkGray'),
    },
  }),
  primary: StyleSheet.create({
    view: {
      backgroundColor: getColor('blue'),
    },
    title: {
      color: getColor('white'),
    },
  }),
};

const sizeStyles = {
  xs: StyleSheet.create({
    title: {
      fontSize: 12,
    },
    button: {
      height: 20,
      paddingHorizontal: 11,
    },
  }),
  sm: StyleSheet.create({
    title: {
      fontSize: 12,
    },
    button: {
      height: 24,
      paddingHorizontal: 15,
    },
  }),
  md: StyleSheet.create({
    title: {
      fontSize: 15,
    },
    button: {
      height: 34,
      paddingHorizontal: 15,
    },
  }),
  lg: StyleSheet.create({
    title: {
      fontSize: 17,
    },
    button: {
      height: 48,
      paddingHorizontal: 15,
    },
  }),
};
