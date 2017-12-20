import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../api';
import { sendTransactionActions, selectActiveWallet } from '../ducks';
import SendTransaction from '../components/SendTransaction';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isLoading: selectIsInProgress(state, apiCallIds.SEND_TRANSACTION),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      sendTransaction: sendTransactionActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTransactionContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Send Transaction',
  };

  onSubmit = transactionData => {
    const { actions, activeWallet } = this.props;

    actions.sendTransaction({
      id: activeWallet.id,
      transactionData,
    });
  };

  render() {
    const { isLoading, activeWallet } = this.props;

    return (
      <Spinner show={isLoading}>
        <SendTransaction onSubmit={this.onSubmit} disabled={!activeWallet} />
      </Spinner>
    );
  }
}
