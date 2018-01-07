import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import {
  getAddressesActions,
  getTxHistoryActions,
  exportWalletActions,
  selectActiveWallet,
} from '../ducks';
import WalletSettings from '../components/WalletSettings';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isGettingAddresses: selectIsInProgress(state, apiCallIds.GET_ADDRESSES),
  isGettingTxHistory: selectIsInProgress(state, apiCallIds.GET_TX_HISTORY),
  isGettingExport: selectIsInProgress(state, apiCallIds.EXPORT_WALLET),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getAddresses: getAddressesActions.request,
      getTxHistory: getTxHistoryActions.request,
      exportWallet: exportWalletActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSettingsContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isGettingAddresses: PropTypes.bool.isRequired,
    isGettingTxHistory: PropTypes.bool.isRequired,
    isGettingExport: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Wallet Settings',
  };

  componentWillMount() {
    this.props.actions.getAddresses();
    this.props.actions.getTxHistory();
  }

  onCopy = text => {
    Clipboard.setString(text);
  };

  render() {
    const {
      activeWallet,
      isGettingAddresses,
      isGettingTxHistory,
      isGettingExport,
      actions,
    } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <Spinner show={isGettingAddresses || isGettingTxHistory || isGettingExport}>
        <WalletSettings
          onCopy={this.onCopy}
          activeWallet={activeWallet}
          exportWallet={actions.exportWallet}
        />
      </Spinner>
    );
  }
}
