import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { getPricesActions, selectPriceForActiveWallet } from '../../price/ducks';
import { apiCallIds } from '../constants';
import { selectActiveWallet, getBalanceActions } from '../ducks';
import ActiveWalletInfo from '../components/ActiveWalletInfo';

const mapStateToProps = state => ({
  wallet: selectActiveWallet(state),
  prices: selectPriceForActiveWallet(state),
  isGettingBalance: selectIsInProgress(state, apiCallIds.GET_BALANCE),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getBalance: getBalanceActions.request,
      getPrices: getPricesActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ActiveWalletInfoContainer extends Component {
  static propTypes = {
    wallet: PropTypes.object,
    prices: PropTypes.object,
    isGettingBalance: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.actions.getBalance();
    this.props.actions.getPrices();
  }

  render() {
    const { isGettingBalance, wallet, prices } = this.props;

    return (
      <Spinner show={isGettingBalance}>
        <ActiveWalletInfo wallet={wallet} price={prices ? prices.USD : undefined} />
      </Spinner>
    );
  }
}
