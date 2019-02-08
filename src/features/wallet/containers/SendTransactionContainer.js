import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertService from '../../../common/services/alert';
import { getTransactionFee } from '../../../btcService';
import { selectIsInProgress } from '../../spinner/ducks';
import { selectPriceForActiveWallet } from '../../prices/ducks';
import { apiCallIds } from '../constants';
import { sendTransactionActions, selectActiveWallet } from '../ducks';
import SendTransaction from '../components/SendTransaction';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  prices: selectPriceForActiveWallet(state),
  isLoading: selectIsInProgress(state, apiCallIds.SEND_TRANSACTION),
});

const mapDispatchToProps = {
  sendTransaction: sendTransactionActions.request,
};

class SendTransactionContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    prices: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    sendTransaction: PropTypes.func.isRequired,
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
    const { activeWallet, sendTransaction } = this.props;
    const { confirmed } = this.state;

    if (confirmed) {
      sendTransaction(transactionData);
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendTransactionContainer);
