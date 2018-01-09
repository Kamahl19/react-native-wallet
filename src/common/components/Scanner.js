import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default class Scanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
  };

  render() {
    const { onRead } = this.props;

    return (
      <QRCodeScanner
        onRead={onRead}
        containerStyle={styles.container}
        cameraStyle={styles.cameraContainer}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  cameraContainer: {
    width: '100%',
  },
});
