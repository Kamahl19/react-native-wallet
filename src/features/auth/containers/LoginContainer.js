import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectIsInProgress } from '../../../features/spinner/ducks';
import Spinner from '../../../features/spinner';
import { apiCallIds } from '../api';
import { loginActions } from '../ducks';
import { Login } from '../components';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.LOGIN),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      login: loginActions.request,
    },
    dispatch
  ),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Login',
  };

  goToSignUp = () => this.props.navigation.navigate('SignUp');

  goToForgottenPassword = () => this.props.navigation.navigate('ForgottenPassword');

  render() {
    const { actions, isLoading } = this.props;

    return (
      <Spinner show={isLoading}>
        <Login
          onSubmit={actions.login}
          goToSignUp={this.goToSignUp}
          goToForgottenPassword={this.goToForgottenPassword}
        />
      </Spinner>
    );
  }
}
