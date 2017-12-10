import React, { Component } from 'react';
import { AlertIOS } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CryptoJS from 'crypto-js';

import { loadWalletAction, selectEncryptedWallets } from '../ducks';
import LoadWallet from '../components/LoadWallet';

const mapStateToProps = state => ({
  encryptedWallets: selectEncryptedWallets(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      loadWallet: loadWalletAction,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class LoadWalletContainer extends Component {
  static propTypes = {
    encryptedWallets: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Load Wallet',
  };

  decryptAndLoad = wallet => {
    AlertIOS.prompt(
      'Enter a password',
      null,
      password => {
        try {
          const decrypted = JSON.parse(
            CryptoJS.Rabbit.decrypt(wallet.encryptedWallet, password).toString(CryptoJS.enc.Utf8)
          );

          this.props.actions.loadWallet(decrypted);
        } catch (error) {
          AlertIOS.alert('Wrong password', 'Try again', this.decryptAndLoad);
        }
      },
      'secure-text'
    );
  };

  render() {
    const { encryptedWallets } = this.props;

    return <LoadWallet loadWallet={this.decryptAndLoad} encryptedWallets={encryptedWallets} />;
  }
}
