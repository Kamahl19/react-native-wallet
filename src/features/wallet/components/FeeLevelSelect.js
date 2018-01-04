import React from 'react';
import PropTypes from 'prop-types';

import { OnePicker, Picker } from '../../../common/components';
import { feeLevelOptions } from '../constants';

const FeeLevelSelect = ({ value, onChange }) => (
  <OnePicker selectedValue={value} onValueChange={onChange} label="Select a Fee Level">
    {feeLevelOptions.map(feeLevel => (
      <Picker.Item label={feeLevel.label} value={feeLevel.value} key={feeLevel.value} />
    ))}
  </OnePicker>
);

FeeLevelSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FeeLevelSelect;
