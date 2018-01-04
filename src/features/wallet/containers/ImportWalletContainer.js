import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { importWalletActions } from '../ducks';
import ImportWallet from '../components/ImportWallet';

const mapStateToProps = state => ({
  isImporting: selectIsInProgress(state, apiCallIds.IMPORT_WALLET),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      importWallet: importWalletActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ImportWalletContainer extends Component {
  static propTypes = {
    isImporting: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Import Wallet',
  };

  render() {
    const { isImporting, actions } = this.props;

    return (
      <Spinner show={isImporting}>
        <ImportWallet importWallet={actions.importWallet} />
      </Spinner>
    );
  }
}
