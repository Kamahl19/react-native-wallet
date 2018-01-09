import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { SegmentedControl } from '../../../common/components';
import { networkOptions } from '../constants';

const values = networkOptions.map(n => n.label);

export default class NetworkSelect extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  onChange = e => {
    const selectedIndex = e.nativeEvent.selectedSegmentIndex;

    this.props.onChange(networkOptions[selectedIndex].value);
  };

  render() {
    const { value } = this.props;

    return (
      <SegmentedControl
        values={values}
        onChange={this.onChange}
        selectedIndex={networkOptions.findIndex(n => n.value === value)}
        style={styles.select}
      />
    );
  }
}

const styles = StyleSheet.create({
  select: {
    marginBottom: 12,
  },
});
