import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { generateAddressActions, selectActiveWalletExtraData } from '../ducks';
import GenerateAddress from '../components/GenerateAddress';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWalletExtraData: selectActiveWalletExtraData(state),
  isLoading: selectIsInProgress(state, apiCallIds.GENERATE_ADDRESS),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      generateAddress: generateAddressActions.request,
    },
    dispatch
  ),
});

class GenerateAddressContainer extends Component {
  static propTypes = {
    activeWalletExtraData: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Generate Address',
  };

  render() {
    const { activeWalletExtraData, isLoading, actions } = this.props;

    if (!activeWalletExtraData) {
      return <NoActiveWallet />;
    }

    return (
      <GenerateAddress
        onSubmit={actions.generateAddress}
        address={activeWalletExtraData.address}
        isLoading={isLoading}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateAddressContainer);
