import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';

import { Button } from '../../../common/components';
import { getExploreTxUrl } from '../../../btcService';

const BtcTxExplorer = ({ txid, network }) => (
  <Button
    title="Explore"
    onPress={() => {
      Linking.openURL(getExploreTxUrl(txid, network)).catch(err =>
        console.error('An error occurred', err)
      );
    }}
  />
);

BtcTxExplorer.propTypes = {
  network: PropTypes.string.isRequired,
  txid: PropTypes.string.isRequired,
};

export default BtcTxExplorer;
