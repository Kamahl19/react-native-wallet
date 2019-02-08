import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { generateAddressActions, selectActiveWalletExtraData } from '../ducks';
import GenerateAddress from '../components/GenerateAddress';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWalletExtraData: selectActiveWalletExtraData(state),
  isLoading: selectIsInProgress(state, apiCallIds.GENERATE_ADDRESS),
});

const mapDispatchToProps = {
  generateAddress: generateAddressActions.request,
};

class GenerateAddressContainer extends Component {
  static propTypes = {
    activeWalletExtraData: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    generateAddress: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Generate Address',
  };

  render() {
    const { activeWalletExtraData, isLoading, generateAddress } = this.props;

    if (!activeWalletExtraData) {
      return <NoActiveWallet />;
    }

    return (
      <GenerateAddress
        onSubmit={generateAddress}
        address={activeWalletExtraData.address}
        isLoading={isLoading}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateAddressContainer);
