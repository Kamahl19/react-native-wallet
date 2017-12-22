import React from 'react';
import PropTypes from 'prop-types';

import { OnePicker, Picker, View, Text } from '../../../common/components';
import { networkOptions } from '../constants';

const NetworkSelect = ({ value, onChange }) => (
  <View>
    <Text>Select a Network</Text>
    <OnePicker selectedValue={value} onValueChange={onChange}>
      {networkOptions.map(network => (
        <Picker.Item label={network.label} value={network.value} key={network.value} />
      ))}
    </OnePicker>
  </View>
);

NetworkSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NetworkSelect;
