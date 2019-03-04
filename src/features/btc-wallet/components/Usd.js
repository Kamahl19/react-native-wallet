import React from 'react';
import PropTypes from 'prop-types';

import { Text } from '../../../common/components';
import { satoshiToUsd } from '../../../unitsService';

const Usd = ({ price, satoshi }) =>
  price ? <Text>(${satoshiToUsd(satoshi, price).toFixed(2)})</Text> : null;

Usd.propTypes = {
  price: PropTypes.number,
  satoshi: PropTypes.any.isRequired,
};

export default Usd;
