import { StyleSheet } from 'react-native';
import memoize from 'lodash.memoize';

const css = (cssProp: string, value: string | number): number => {
  return StyleSheet.create({
    cachedStyle: {
      [cssProp]: value,
    },
  }).cachedStyle;
};

const memoizedCss = memoize(css, (cssProp, value) => {
  return `cssProp:${cssProp}, value: ${value}`;
});

export { memoizedCss as css };
