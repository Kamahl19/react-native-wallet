import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';

import { Button } from '../../../common/components';
import { getExploreAddressUrl } from '../../../btcService';

const BtcAddressExplorer = ({ address, network }) => (
  <Button
    title="Explore"
    onPress={() => {
      Linking.openURL(getExploreAddressUrl(address, network)).catch(err =>
        console.error('An error occurred', err)
      );
    }}
  />
);

BtcAddressExplorer.propTypes = {
  address: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
};

export default BtcAddressExplorer;
