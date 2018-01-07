import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { exportWalletActions, selectActiveWallet } from '../ducks';
import ExportWallet from '../components/ExportWallet';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isGettingExport: selectIsInProgress(state, apiCallIds.EXPORT_WALLET),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      exportWallet: exportWalletActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ExportWalletContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isGettingExport: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Export Wallet',
  };

  onCopy = text => {
    Clipboard.setString(text);
  };

  render() {
    const { activeWallet, isGettingExport, actions } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <Spinner show={isGettingExport}>
        <ExportWallet
          onCopy={this.onCopy}
          activeWallet={activeWallet}
          exportWallet={actions.exportWallet}
        />
      </Spinner>
    );
  }
}
