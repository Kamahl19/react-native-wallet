import React from 'react';
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

const GenerateAddressContainer = ({ activeWalletExtraData, isLoading, generateAddress }) => {
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
};

GenerateAddressContainer.propTypes = {
  activeWalletExtraData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  generateAddress: PropTypes.func.isRequired,
};

GenerateAddressContainer.navigationOptions = {
  title: 'Generate Address',
};

export default connect(mapStateToProps, mapDispatchToProps)(GenerateAddressContainer);
