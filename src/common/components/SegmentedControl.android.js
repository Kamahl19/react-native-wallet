import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons';

export default class SegmentedControlAndroid extends Component {
  static propTypes = {
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    selectedIndex: PropTypes.number,
    style: PropTypes.any,
  };

  onChange = (selectedOption, selectedIndex) => {
    const { onChange } = this.props;

    onChange({ nativeEvent: { selectedSegmentIndex: selectedIndex } });
  };

  render() {
    const { values, style, selectedIndex } = this.props;

    return (
      <View style={style}>
        <SegmentedControls
          options={values}
          onSelection={this.onChange}
          selectedIndex={selectedIndex}
        />
      </View>
    );
  }
}
