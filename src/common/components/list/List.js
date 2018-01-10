import React from 'react';
import { StyleSheet } from 'react-native';

import { FlatList } from '../';
import Separator from './Separator';

const List = props => (
  <FlatList ItemSeparatorComponent={Separator} {...props} style={styles.list} />
);

export default List;

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'white',
  },
});
