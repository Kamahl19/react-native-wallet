import React from 'react';
import PropTypes from 'prop-types';

import { OnePicker, Picker } from '../../../common/components';
import { networkOptions } from '../constants';

const NetworkSelect = ({ value, onChange }) => (
  <OnePicker selectedValue={value} onValueChange={onChange}>
    {networkOptions.map(network => (
      <Picker.Item label={network.label} value={network.value} key={network.value} />
    ))}
  </OnePicker>
);

NetworkSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NetworkSelect;
