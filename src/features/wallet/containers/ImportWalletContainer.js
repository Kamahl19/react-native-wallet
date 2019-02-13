import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../spinner/ducks';

import { apiCallIds } from '../constants';
import { importWalletActions } from '../ducks';
import ImportWallet from '../screens/ImportWallet';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.IMPORT_WALLET),
});

const mapDispatchToProps = {
  importWallet: importWalletActions.request,
};

const ImportWalletContainer = ({ isLoading, importWallet }) => (
  <ImportWallet importWallet={importWallet} isLoading={isLoading} />
);

ImportWalletContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  importWallet: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportWalletContainer);
