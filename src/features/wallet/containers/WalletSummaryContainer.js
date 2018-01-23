import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getWalletBalance } from '../../../btcService';
import { selectPriceForActiveWallet } from '../../price/ducks';
import { FETCH_BALANCE_INTERVAL_MS } from '../constants';
import { selectActiveWallet, selectActiveWalletExtraData, getBalanceActions } from '../ducks';
import WalletSummary from '../components/WalletSummary';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  activeWalletExtraData: selectActiveWalletExtraData(state),
  prices: selectPriceForActiveWallet(state),
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
export default class WalletSummaryContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    activeWalletExtraData: PropTypes.object,
    prices: PropTypes.object,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    if (this.props.activeWallet) {
      this.startFetching();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.activeWallet &&
      (!this.props.activeWallet ||
        nextProps.activeWallet.walletId !== this.props.activeWallet.walletId)
    ) {
      this.startFetching();
    } else if (!nextProps.activeWallet) {
      this.stopFetching();
    }
  }

  componentWillUnmount() {
    this.stopFetching();
  }

  startFetching = () => {
    this.stopFetching();
    const { actions } = this.props;

    actions.getBalance();

    this.balanceInterval = setInterval(actions.getBalance, FETCH_BALANCE_INTERVAL_MS);
  };

  stopFetching = () => {
    clearInterval(this.balanceInterval);
  };

  render() {
    const { activeWallet, activeWalletExtraData, prices } = this.props;

    const balance =
      activeWalletExtraData && activeWalletExtraData.balance
        ? getWalletBalance(activeWalletExtraData.balance)
        : undefined;

    return (
      <WalletSummary
        wallet={activeWallet}
        balance={balance}
        price={prices ? prices.USD : undefined}
      />
    );
  }
}
