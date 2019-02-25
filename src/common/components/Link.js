import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';

import Button from './Button';

const Link = ({ url, title }) => (
  <Button
    title={title}
    onPress={() => {
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }}
  />
);

Link.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Link;
