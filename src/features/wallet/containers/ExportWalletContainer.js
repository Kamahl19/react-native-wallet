import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { exportWalletActions, selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import ExportWallet from '../components/ExportWallet';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  isLoading: selectIsInProgress(state, apiCallIds.EXPORT_WALLET),
});

const mapDispatchToProps = {
  exportWallet: exportWalletActions.request,
};

class ExportWalletContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    activeWalletExtraData: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    exportWallet: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Backup Wallet',
  };

  render() {
    const { activeWallet, activeWalletExtraData, isLoading, exportWallet } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <ExportWallet
        mnemonic={activeWallet.mnemonic}
        exported={activeWalletExtraData.exported}
        exportWallet={exportWallet}
        isLoading={isLoading}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportWalletContainer);
