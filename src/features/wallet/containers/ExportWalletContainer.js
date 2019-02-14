import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../../common/services/spinner';

import { apiCallIds } from '../constants';
import { exportWalletActions, selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import NoActiveWallet from '../components/NoActiveWallet';
import ExportWallet from '../screens/ExportWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  isLoading: selectIsInProgress(state, apiCallIds.EXPORT_WALLET),
});

const mapDispatchToProps = {
  exportWallet: exportWalletActions.request,
};

const ExportWalletContainer = ({ activeWallet, activeWalletExtraData, isLoading, exportWallet }) =>
  !activeWallet ? (
    <NoActiveWallet />
  ) : (
    <ExportWallet
      mnemonic={activeWallet.mnemonic}
      exported={activeWalletExtraData.exported}
      exportWallet={exportWallet}
      isLoading={isLoading}
    />
  );

ExportWalletContainer.propTypes = {
  activeWallet: PropTypes.object,
  activeWalletExtraData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  exportWallet: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportWalletContainer);
