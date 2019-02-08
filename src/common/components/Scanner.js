import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const Scanner = ({ onRead }) => (
  <QRCodeScanner
    onRead={onRead}
    containerStyle={styles.container}
    cameraStyle={styles.cameraContainer}
  />
);

Scanner.propTypes = {
  onRead: PropTypes.func.isRequired,
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  cameraContainer: {
    width: '100%',
  },
});
