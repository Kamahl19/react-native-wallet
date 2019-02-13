import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { SegmentedControl } from '../../../common/components';

import { txActionsOptions } from '../constants';

const values = txActionsOptions.map(n => n.label);

const TxTypeSelect = ({ onChange, value }) => (
  <SegmentedControl
    values={values}
    onChange={({ nativeEvent: { selectedSegmentIndex } }) =>
      onChange(txActionsOptions[selectedSegmentIndex].value)
    }
    selectedIndex={txActionsOptions.findIndex(n => n.value === value)}
    style={styles.select}
  />
);

TxTypeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TxTypeSelect;

const styles = StyleSheet.create({
  select: {
    marginBottom: 12,
  },
});
