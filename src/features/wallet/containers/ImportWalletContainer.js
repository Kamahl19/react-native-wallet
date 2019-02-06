import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { importWalletActions } from '../ducks';
import ImportWallet from '../components/ImportWallet';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.IMPORT_WALLET),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      importWallet: importWalletActions.request,
    },
    dispatch
  ),
});

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class ImportWalletContainer extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Restore Wallet',
  };

  render() {
    const { isLoading, actions } = this.props;

    return <ImportWallet importWallet={actions.importWallet} isLoading={isLoading} />;
  }
}
