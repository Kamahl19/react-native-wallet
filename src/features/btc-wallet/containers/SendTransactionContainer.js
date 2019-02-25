import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../../common/services/spinner';
import AlertService from '../../../common/services/alert';
import { NoActiveWallet } from '../../../common/components';
import { getTransactionFee } from '../../../btcService';
import { selectPrices } from '../../prices/ducks';

import { apiCallIds } from '../constants';
import { sendTransactionActions, selectActiveWallet } from '../ducks';
import SendTransaction from '../screens/SendTransaction';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  btcPrice: selectPrices(state).BTC,
  isLoading: selectIsInProgress(state, apiCallIds.SEND_TRANSACTION),
});

const mapDispatchToProps = {
  sendTransaction: sendTransactionActions.request,
};

class SendTransactionContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    btcPrice: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    sendTransaction: PropTypes.func.isRequired,
  };

  state = {
    confirmed: false,
    calculatedFee: undefined,
    isFetchingFee: false,
  };

  handleInputChange = () => {
    this.setState({
      confirmed: false,
      calculatedFee: undefined,
    });
  };

  handleSubmit = async transactionData => {
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
    const { isLoading, activeWallet, btcPrice } = this.props;
    const { calculatedFee, confirmed, isFetchingFee } = this.state;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <SendTransaction
        onSubmit={this.handleSubmit}
        onInputChange={this.handleInputChange}
        calculatedFee={calculatedFee}
        confirmed={confirmed}
        price={btcPrice ? btcPrice.USD : undefined}
        isLoading={isLoading || isFetchingFee}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendTransactionContainer);
