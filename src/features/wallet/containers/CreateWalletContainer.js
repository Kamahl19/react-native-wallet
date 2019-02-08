import React, { Component } from 'react';
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

class CreateWalletContainer extends Component {
  static propTypes = {
    createWallet: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  static navigationOptions = {
    title: 'Create Wallet',
  };

  render() {
    const { isLoading, createWallet } = this.props;

    return <CreateWallet onSubmit={createWallet} isLoading={isLoading} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWalletContainer);
