import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import SegmentedControl from './SegmentedControl';

const Radio = ({ options, value, onChange }) => (
  <SegmentedControl
    values={options.map((n) => n.label)}
    onChange={({ nativeEvent: { selectedSegmentIndex } }) =>
      onChange(options[selectedSegmentIndex].value)
    }
    selectedIndex={options.findIndex((n) => n.value === value)}
    style={styles.select}
  />
);

Radio.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Radio;

const styles = StyleSheet.create({
  select: {
    marginBottom: 12,
  },
});
