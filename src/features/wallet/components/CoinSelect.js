import React from 'react';
import PropTypes from 'prop-types';

import { OnePicker, Picker } from '../../../common/components';
import { coinOptions } from '../constants';

const CoinSelect = ({ value, onChange }) => (
  <OnePicker selectedValue={value} onValueChange={onChange} label="Select a Coin">
    {coinOptions.map(coin => (
      <Picker.Item label={coin.label} value={coin.value} key={coin.value} />
    ))}
  </OnePicker>
);

CoinSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CoinSelect;
