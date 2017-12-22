import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { getBalanceActions, selectActiveWallet } from '../ducks';
import WalletSettings from '../components/WalletSettings';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isGettingBalance: selectIsInProgress(state, apiCallIds.GET_BALANCE),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getBalance: getBalanceActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletSettingsContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isGettingBalance: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Wallet Settings',
  };

  componentWillMount() {
    this.props.actions.getBalance();
  }

  onCopy = text => {
    Clipboard.setString(text);
  };

  render() {
    const { activeWallet, isGettingBalance } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <WalletSettings
        onCopy={this.onCopy}
        isGettingBalance={isGettingBalance}
        activeWallet={activeWallet}
      />
    );
  }
}
