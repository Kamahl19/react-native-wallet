import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

const List = props => (
  <FlatList
    ItemSeparatorComponent={<View style={styles.separator} />}
    {...props}
    style={styles.list}
  />
);

export default List;

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'white',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
  },
});
