import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { NoActiveWallet } from '../../../common/components';

import { selectActiveWallet } from '../ducks';
import ExportWallet from '../screens/ExportWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
});

const ExportWalletContainer = ({ activeWallet }) =>
  !activeWallet ? <NoActiveWallet /> : <ExportWallet mnemonic={activeWallet.mnemonic} />;

ExportWalletContainer.propTypes = {
  activeWallet: PropTypes.object,
};

export default connect(mapStateToProps)(ExportWalletContainer);
