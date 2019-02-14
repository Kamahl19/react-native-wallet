import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectIsInProgress } from '../../../common/services/spinner';

import { apiCallIds } from '../constants';
import { generateAddressActions, selectActiveWalletExtraData } from '../ducks';
import NoActiveWallet from '../components/NoActiveWallet';
import GenerateAddress from '../screens/GenerateAddress';

const mapStateToProps = state => ({
  activeWalletExtraData: selectActiveWalletExtraData(state),
  isLoading: selectIsInProgress(state, apiCallIds.GENERATE_ADDRESS),
});

const mapDispatchToProps = {
  generateAddress: generateAddressActions.request,
};

const GenerateAddressContainer = ({ activeWalletExtraData, isLoading, generateAddress }) =>
  !activeWalletExtraData ? (
    <NoActiveWallet />
  ) : (
    <GenerateAddress
      onSubmit={generateAddress}
      address={activeWalletExtraData.address}
      isLoading={isLoading}
    />
  );

GenerateAddressContainer.propTypes = {
  activeWalletExtraData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  generateAddress: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenerateAddressContainer);
