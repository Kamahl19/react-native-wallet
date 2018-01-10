import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CenterView, ActivityIndicator } from '../../../common/components';
import { selectIsInProgress } from '../../spinner/ducks';
import { apiCallIds } from '../constants';
import { getAddressesActions, selectActiveWallet } from '../ducks';
import Addresses from '../components/Addresses';
import NoActiveWallet from '../components/NoActiveWallet';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
  isLoading: selectIsInProgress(state, apiCallIds.GET_ADDRESSES),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getAddresses: getAddressesActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class AddressesContainer extends Component {
  static propTypes = {
    activeWallet: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Addresses',
  };

  componentWillMount() {
    this.props.actions.getAddresses();
  }

  render() {
    const { activeWallet, isLoading } = this.props;

    if (!activeWallet) {
      return <NoActiveWallet />;
    }

    if (isLoading) {
      return (
        <CenterView>
          <ActivityIndicator />
        </CenterView>
      );
    }

    console.log(activeWallet);

    return <Addresses network={activeWallet.network} addresses={activeWallet.addresses} />;
  }
}
