import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AlertService from '../../../common/services/alert';
import { getTransactionFee } from '../../../btcService';
import { selectIsInProgress } from '../../spinner/ducks';
import { selectPriceForActiveWallet } from '../../price/ducks';
import { apiCallIds } from '../constants';
import { sendTransactionAction, selectActiveWallet } from '../ducks';
import SendTransaction from '../components/SendTransaction';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  prices: selectPriceForActiveWallet(state),
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
    activeWallet: PropTypes.object,
    prices: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Send Transaction',
  };

  state = {
    confirmed: false,
    calculatedFee: undefined,
    isFetchingFee: false,
  };

  onInputChange = () => {
    this.setState({
      confirmed: false,
      calculatedFee: undefined,
    });
  };

  onSubmit = async transactionData => {
    const { activeWallet, actions } = this.props;
    const { confirmed } = this.state;

    if (confirmed) {
      actions.sendTransaction(transactionData);
    } else {
      let fee;

      this.setState({
        isFetchingFee: true,
      });

      try {
        fee = await getTransactionFee(
          activeWallet,
          transactionData.address,
          transactionData.amount,
          transactionData.feeLevel
        );

        this.setState({
          confirmed: true,
          calculatedFee: fee,
        });
      } catch (error) {
        AlertService.error(error.message);
      } finally {
        this.setState({
          isFetchingFee: false,
        });
      }
    }
  };

  render() {
    const { isLoading, activeWallet, prices } = this.props;
    const { calculatedFee, confirmed, isFetchingFee } = this.state;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <SendTransaction
        onSubmit={this.onSubmit}
        onInputChange={this.onInputChange}
        calculatedFee={calculatedFee}
        confirmed={confirmed}
        price={prices ? prices.USD : undefined}
        isLoading={isLoading || isFetchingFee}
      />
    );
  }
}
