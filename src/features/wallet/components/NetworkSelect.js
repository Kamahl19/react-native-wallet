import React from 'react';
import PropTypes from 'prop-types';
import RadioForm from 'react-native-simple-radio-button';

import { networkOptions } from '../walletUtils.js';

const NetworkSelect = ({ onChange }) => (
  <RadioForm radio_props={networkOptions} initial={0} onPress={onChange} formHorizontal />
);

NetworkSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default NetworkSelect;
