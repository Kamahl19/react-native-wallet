import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { createWalletActions } from '../ducks';
import CreateWallet from '../components/CreateWallet';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.CREATE_WALLET),
});

const mapDispatchToProps = {
  createWallet: createWalletActions.request,
};

const CreateWalletContainer = ({ isLoading, createWallet }) => (
  <CreateWallet onSubmit={createWallet} isLoading={isLoading} />
);

CreateWalletContainer.propTypes = {
  createWallet: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

CreateWalletContainer.navigationOptions = {
  title: 'Create Wallet',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletContainer);
