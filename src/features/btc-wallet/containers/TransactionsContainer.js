import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../../common/services/spinner';
import { NoActiveWallet } from '../../../common/components';

import { apiCallIds } from '../constants';
import { getTxHistoryActions, selectActiveWallet, selectActiveWalletExtraData } from '../ducks';
import Transactions from '../screens/Transactions';

const mapStateToProps = (state) => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  isLoading: selectIsInProgress(state, apiCallIds.GET_TX_HISTORY),
});

const mapDispatchToProps = {
  getTxHistory: getTxHistoryActions.request,
};

class TransactionsContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    activeWalletExtraData: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    getTxHistory: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.getTxHistory();
  }

  render() {
    const { activeWallet, activeWalletExtraData, isLoading, getTxHistory } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <Transactions
        network={activeWallet.network}
        txs={activeWalletExtraData.txs}
        onRefresh={getTxHistory}
        isLoading={isLoading}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsContainer);
