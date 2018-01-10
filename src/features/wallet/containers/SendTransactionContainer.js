import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { sendTransactionAction, selectActiveWalletId } from '../ducks';
import SendTransaction from '../components/SendTransaction';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWalletId: selectActiveWalletId(state),
  isLoading: selectIsInProgress(state, apiCallIds.SEND_TRANSACTION),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      sendTransaction: sendTransactionAction,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTransactionContainer extends Component {
  static propTypes = {
    activeWalletId: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Send Transaction',
  };

  onSubmit = transactionData => {
    const { actions } = this.props;

    actions.sendTransaction(transactionData);
  };

  render() {
    const { isLoading, activeWalletId } = this.props;

    if (!activeWalletId) {
      return <NoActiveWallet />;
    }

    return <SendTransaction onSubmit={this.onSubmit} isLoading={isLoading} />;
  }
}
