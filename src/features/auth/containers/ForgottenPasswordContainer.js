import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectIsInProgress } from '../../../features/spinner/ducks';
import Spinner from '../../../features/spinner';
import { apiCallIds } from '../api';
import { forgottenPasswordRequest } from '../ducks';
import { ForgottenPassword } from '../components';

const mapStateToProps = state => ({
  isLoading: selectIsInProgress(state, apiCallIds.LOGIN),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      forgottenPasswordRequest,
    },
    dispatch
  ),
});

const ForgottenPasswordContainer = ({ actions, isLoading }) => (
  <Spinner show={isLoading}>
    <ForgottenPassword onSubmit={actions.forgottenPasswordRequest} />
  </Spinner>
);

ForgottenPasswordContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenPasswordContainer);
