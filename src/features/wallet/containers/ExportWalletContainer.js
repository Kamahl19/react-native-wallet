import React from 'react';
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

const ExportWalletContainer = ({
  activeWallet,
  activeWalletExtraData,
  isLoading,
  exportWallet,
}) => {
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
};

ExportWalletContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  exportWallet: PropTypes.func.isRequired,
};

ExportWalletContainer.navigationOptions = {
  title: 'Backup Wallet',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportWalletContainer);
