import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { importWalletActions } from '../ducks';
import ImportWallet from '../components/ImportWallet';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.IMPORT_WALLET),
});

const mapDispatchToProps = {
  importWallet: importWalletActions.request,
};

class ImportWalletContainer extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    importWallet: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Restore Wallet',
  };

  render() {
    const { isLoading, importWallet } = this.props;

    return <ImportWallet importWallet={importWallet} isLoading={isLoading} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletContainer);
