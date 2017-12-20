import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertIOS, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../spinner';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../api';
import { generateAddressActions, selectActiveWallet } from '../ducks';
import GenerateAddress from '../components/GenerateAddress';

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

  onSubmit = () => {
    AlertIOS.prompt(
      'Enter a password',
      null,
      password => {
        if (password === '') {
          AlertIOS.alert('Empty password', this.onSubmit);
        }

        const { actions, activeWallet } = this.props;

        actions.generateAddress({
          id: activeWallet.id,
          password,
        });
      },
      'secure-text'
    );
  };

  onCopy = () => {
    Clipboard.setString(this.props.address);
  };

  render() {
    const { activeWallet, isLoading } = this.props;

    return (
      <Spinner show={isLoading}>
        <GenerateAddress
          onSubmit={this.onSubmit}
          onCopy={this.onCopy}
          disabled={!activeWallet}
          address={activeWallet ? activeWallet.address : undefined}
        />
      </Spinner>
    );
  }
}
