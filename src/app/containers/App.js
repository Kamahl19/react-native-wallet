import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';

import Network from './Network';
import { View } from '../../common/components';
import AlertService from '../../common/services/alert';
import Spinner from '../../features/spinner';
import { selectShowSpinner } from '../../features/spinner/ducks';
import AppNavigator from '../navigators/AppNavigator';

const mapStateToProps = state => ({
  showSpinner: selectShowSpinner(state),
});

const App = ({ showSpinner }) => (
  <View style={styles.component}>
    <Network />
    <AppNavigator />
    {showSpinner && <Spinner large />}
    <DropdownAlert ref={ref => AlertService.setAlert(ref)} />
  </View>
);

App.propTypes = {
  showSpinner: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(App);

const styles = StyleSheet.create({
  component: {
    flexGrow: 1,
  },
});
