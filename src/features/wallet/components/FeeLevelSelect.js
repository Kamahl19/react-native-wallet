import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { OnePicker, Picker, View, Text } from '../../../common/components';
import { feeLevelOptions } from '../constants';
import { selectActiveWallet } from '../ducks';

const mapStateToProps = state => ({
  activeWallet: selectActiveWallet(state),
});

const FeeLevelSelect = ({ value, onChange, activeWallet }) => (
  <View>
    <Text>Select a Coin</Text>
    <OnePicker selectedValue={value} onValueChange={onChange}>
      {feeLevelOptions[activeWallet.coin].map(feeLevel => (
        <Picker.Item label={feeLevel.label} value={feeLevel.value} key={feeLevel.value} />
      ))}
    </OnePicker>
  </View>
);

FeeLevelSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  activeWallet: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FeeLevelSelect);
