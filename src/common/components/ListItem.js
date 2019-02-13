import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

const ListItem = ({ children, title }) => {
  const content = typeof children === 'string' ? <Text>{children}</Text> : children;

  return (
    <View style={styles.container}>
      {title ? (
        <Fragment>
          <Text style={styles.title}>{title}</Text>
          {content}
        </Fragment>
      ) : (
        content
      )}
    </View>
  );
};

ListItem.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  title: { fontWeight: 'bold' },
});
