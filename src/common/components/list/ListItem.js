import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { View } from '../';

const ListItem = ({ content }) => <View style={styles.item}>{content}</View>;

ListItem.propTypes = {
  content: PropTypes.node.isRequired,
};

export default ListItem;

const styles = StyleSheet.create({
  item: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
