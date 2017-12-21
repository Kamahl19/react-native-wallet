import React from 'react';
import PropTypes from 'prop-types';

import { OnePicker, Picker, View, Text } from '../../../common/components';
import { coinOptions } from '../constants';

const CoinSelect = ({ value, onChange }) => (
  <View>
    <Text>Select a Coin</Text>
    <OnePicker selectedValue={value} onValueChange={onChange}>
      {coinOptions.map(coin => (
        <Picker.Item label={coin.label} value={coin.value} key={coin.value} />
      ))}
    </OnePicker>
  </View>
);

CoinSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CoinSelect;
