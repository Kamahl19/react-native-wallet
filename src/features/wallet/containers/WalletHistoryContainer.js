import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { getAddressesActions, getTxHistoryActions, selectActiveWallet } from '../ducks';
import WalletHistory from '../components/WalletHistory';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isGettingAddresses: selectIsInProgress(state, apiCallIds.GET_ADDRESSES),
  isGettingTxHistory: selectIsInProgress(state, apiCallIds.GET_TX_HISTORY),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getAddresses: getAddressesActions.request,
      getTxHistory: getTxHistoryActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletHistoryContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isGettingAddresses: PropTypes.bool.isRequired,
    isGettingTxHistory: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Wallet History',
  };

  componentWillMount() {
    this.props.actions.getAddresses();
    this.props.actions.getTxHistory();
  }

  render() {
    const { activeWallet, isGettingAddresses, isGettingTxHistory } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <Spinner show={isGettingAddresses || isGettingTxHistory}>
        <WalletHistory activeWallet={activeWallet} />
      </Spinner>
    );
  }
}
