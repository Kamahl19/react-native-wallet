import React from 'react';
import PropTypes from 'prop-types';

import { Text } from '../../../common/components';
import { formatWeiToEther } from '../../../ethService';

const Eth = ({ wei }) => <Text>{formatWeiToEther(wei)} ETH</Text>;

Eth.propTypes = {
  wei: PropTypes.object.isRequired,
};

export default Eth;
