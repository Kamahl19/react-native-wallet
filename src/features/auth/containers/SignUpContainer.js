import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectIsInProgress } from '../../../features/spinner/ducks';
import Spinner from '../../../features/spinner';
import { apiCallIds } from '../api';
import { signUpRequest } from '../ducks';
import { SignUp } from '../components';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.LOGIN),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ signUp: signUpRequest }, dispatch),
});

const SignUpContainer = ({ actions, isLoading }) => (
  <Spinner show={isLoading}>
    <SignUp onSubmit={actions.signUp} />
  </Spinner>
);

SignUpContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer);
