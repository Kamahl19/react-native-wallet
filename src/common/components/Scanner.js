import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const Scanner = ({ onRead }) => <QRCodeScanner cameraStyle={styles.camera} onRead={onRead} />;

Scanner.propTypes = {
  onRead: PropTypes.func.isRequired,
};

export default Scanner;

const styles = StyleSheet.create({
  camera: {
    width: '100%',
  },
});
