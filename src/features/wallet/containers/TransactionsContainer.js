import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CenterView, ActivityIndicator } from '../../../common/components';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { getTxHistoryActions, selectActiveWallet } from '../ducks';
import Transactions from '../components/Transactions';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isLoading: selectIsInProgress(state, apiCallIds.GET_TX_HISTORY),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getTxHistory: getTxHistoryActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class TransactionsContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Transactions',
  };

  componentWillMount() {
    this.props.actions.getTxHistory();
  }

  render() {
    const { activeWallet, isLoading } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    if (isLoading) {
      return (
        <CenterView>
          <ActivityIndicator />
        </CenterView>
      );
    }

    return <Transactions network={activeWallet.network} transactions={activeWallet.txs} />;
  }
}
