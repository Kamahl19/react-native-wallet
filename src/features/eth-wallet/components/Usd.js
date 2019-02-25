import React from 'react';
import PropTypes from 'prop-types';

import { Text } from '../../../common/components';
import { weiToUsd } from '../../../unitsService';

const Usd = ({ price, wei }) => (price ? <Text>(${weiToUsd(wei, price)})</Text> : null);

Usd.propTypes = {
  price: PropTypes.number,
  wei: PropTypes.any.isRequired,
};

export default Usd;
