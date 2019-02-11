import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { FIELD_META_PROP } from '../services/Form';
import { getColor } from '../utils/color';

export default class FormItem extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.string,
  };

  static contextTypes = {
    form: PropTypes.object.isRequired,
  };

  getControls(children, recursively) {
    let controls = [];
    const childrenArray = React.Children.toArray(children);

    for (let i = 0; i < childrenArray.length; i++) {
      if (!recursively && controls.length > 0) {
        break;
      }

      const child = childrenArray[i];

      if (child.type === FormItem) {
        continue;
      }

      if (!child.props) {
        continue;
      }

      if (FIELD_META_PROP in child.props) {
        controls.push(child);
      } else if (child.props.children) {
        controls = controls.concat(this.getControls(child.props.children, recursively));
      }
    }

    return controls;
  }

  getChildProp(prop) {
    const child = this.getControls(this.props.children, false)[0];
    return child && child.props && child.props[prop];
  }

  getError() {
    const { isFieldValidating, getFieldError } = this.context.form;
    const fieldId = this.getChildProp('id');

    if (!isFieldValidating(fieldId) && getFieldError(fieldId)) {
      return getFieldError(fieldId).join(', ');
    }
  }

  render() {
    const { children, label } = this.props;

    const error = this.getError();

    return (
      <View>
        {label && <Text>{label}</Text>}
        {children}
        {!!error && <Text style={{ color: getColor('red') }}>{error}</Text>}
      </View>
    );
  }
}
