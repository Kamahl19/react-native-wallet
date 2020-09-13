import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../../common/services/spinner';
import { NoActiveWallet } from '../../../common/components';
import { selectPrices } from '../../prices/ducks';

import { apiCallIds } from '../constants';
import { sendTransactionActions, selectActiveWallet } from '../ducks';
import SendTransaction from '../screens/SendTransaction';

const mapStateToProps = (state) => ({
  activeWallet: selectActiveWallet(state),
  ethPrice: selectPrices(state).ETH,
  isLoading: selectIsInProgress(state, apiCallIds.SEND_TRANSACTION),
});

const mapDispatchToProps = {
  sendTransaction: sendTransactionActions.request,
};

const SendTransactionContainer = ({ sendTransaction, isLoading, activeWallet, ethPrice }) =>
  !activeWallet ? (
    <NoActiveWallet />
  ) : (
    <SendTransaction
      onSubmit={sendTransaction}
      price={ethPrice ? ethPrice.USD : undefined}
      isLoading={isLoading}
    />
  );

SendTransactionContainer.propTypes = {
  activeWallet: PropTypes.object,
  ethPrice: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  sendTransaction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SendTransactionContainer);
