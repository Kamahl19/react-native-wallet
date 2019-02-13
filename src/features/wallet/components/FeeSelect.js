import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { SegmentedControl } from '../../../common/components';

import { feeLevelOptions } from '../constants';

const values = feeLevelOptions.map(n => n.label);

const FeeSelect = ({ onChange, value }) => (
  <SegmentedControl
    values={values}
    onChange={({ nativeEvent: { selectedSegmentIndex } }) =>
      onChange(feeLevelOptions[selectedSegmentIndex].value)
    }
    selectedIndex={feeLevelOptions.findIndex(n => n.value === value)}
    style={styles.select}
  />
);

FeeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FeeSelect;

const styles = StyleSheet.create({
  select: {
    marginBottom: 12,
  },
});
