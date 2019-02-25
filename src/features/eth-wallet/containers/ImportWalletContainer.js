import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../../common/services/spinner';

import { apiCallIds } from '../constants';
import { createWalletActions } from '../ducks';
import ImportWallet from '../screens/ImportWallet';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.CREATE_WALLET),
});

const mapDispatchToProps = {
  createWallet: createWalletActions.request,
};

const ImportWalletContainer = ({ isLoading, createWallet }) => (
  <ImportWallet onSubmit={createWallet} isLoading={isLoading} />
);

ImportWalletContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  createWallet: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportWalletContainer);
