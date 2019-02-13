import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import RNQRCode from 'react-native-qrcode-svg';

import { View } from '../../../common/components';

const QRCode = ({ value }) => (
  <View style={styles.container}>
    <RNQRCode value={value} />
  </View>
);

QRCode.propTypes = {
  value: PropTypes.string.isRequired,
};

export default QRCode;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});
