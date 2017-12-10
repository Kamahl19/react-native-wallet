import React from 'react';
import PropTypes from 'prop-types';
import RadioForm from 'react-native-simple-radio-button';

import { coinOptions } from '../walletUtils.js';

const CoinSelect = ({ onChange }) => (
  <RadioForm radio_props={coinOptions} initial={0} onPress={onChange} formHorizontal />
);

CoinSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CoinSelect;
