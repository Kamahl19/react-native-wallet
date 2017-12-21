import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { generateAddressActions, selectActiveWallet } from '../ducks';
import GenerateAddress from '../components/GenerateAddress';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
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

@connect(mapStateToProps, mapDispatchToProps)
export default class GenerateAddressContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Generate Address',
  };

  onCopy = () => {
    Clipboard.setString(this.props.address);
  };

  render() {
    const { activeWallet, isLoading, actions } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    return (
      <Spinner show={isLoading}>
        <GenerateAddress
          onSubmit={actions.generateAddress}
          onCopy={this.onCopy}
          address={activeWallet.address}
        />
      </Spinner>
    );
  }
}
