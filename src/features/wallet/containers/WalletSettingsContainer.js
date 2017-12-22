import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import {
  getBalanceActions,
  getAddressesActions,
  getTxHistoryActions,
  selectActiveWallet,
} from '../ducks';
import WalletSettings from '../components/WalletSettings';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isGettingBalance: selectIsInProgress(state, apiCallIds.GET_BALANCE),
  isGettingAddresses: selectIsInProgress(state, apiCallIds.GET_ADDRESSES),
  isGettingTxHistory: selectIsInProgress(state, apiCallIds.GET_TX_HISTORY),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getBalance: getBalanceActions.request,
      getAddresses: getAddressesActions.request,
      getTxHistory: getTxHistoryActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSettingsContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isGettingBalance: PropTypes.bool.isRequired,
    isGettingAddresses: PropTypes.bool.isRequired,
    isGettingTxHistory: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Wallet Settings',
  };

  componentWillMount() {
    this.props.actions.getBalance();
    this.props.actions.getAddresses();
    this.props.actions.getTxHistory();
  }

  onCopy = text => {
    Clipboard.setString(text);
  };

  render() {
    const { activeWallet, isGettingBalance, isGettingAddresses, isGettingTxHistory } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <Spinner show={isGettingBalance || isGettingAddresses || isGettingTxHistory}>
        <WalletSettings onCopy={this.onCopy} activeWallet={activeWallet} />
      </Spinner>
    );
  }
}
