import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';

import { FIELD_META_PROP } from '../services/Form';
import { getColor } from '../utils/color';

import { Text, View } from './';

export default props => (
  <FormItem
    errorColor={getColor('red')}
    successColor={getColor('green')}
    validatingColor={getColor('gray')}
    {...props}
  />
);

class FormItem extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.string,
    successColor: PropTypes.string,
    errorColor: PropTypes.string,
    validatingColor: PropTypes.string,
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

  getOnlyControl() {
    const child = this.getControls(this.props.children, false)[0];
    return child !== undefined ? child : null;
  }

  getChildProp(prop) {
    const child = this.getOnlyControl();
    return child && child.props && child.props[prop];
  }

  getId() {
    return this.getChildProp('id');
  }

  getValidateStatus() {
    const { isFieldValidating, getFieldError, getFieldValue } = this.context.form;
    const fieldId = this.getId();

    if (!fieldId) {
      return '';
    }

    if (isFieldValidating(fieldId)) {
      return 'validating';
    }

    if (!!getFieldError(fieldId)) {
      return 'error';
    }

    const fieldValue = getFieldValue(fieldId);

    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      return 'success';
    }

    return '';
  }

  getHelpMsg() {
    const { form } = this.context;

    if (!form) {
      return;
    }

    const fieldId = this.getId();

    if (!fieldId) {
      return '';
    }

    return (form.getFieldError(fieldId) || []).join(', ');
  }

  render() {
    const { children, label } = this.props;

    const validateStatus = this.getValidateStatus();
    const helpMsg = this.getHelpMsg();

    return (
      <View>
        {label && <Text>{label}</Text>}
        {cloneElement(children, {
          error: !!validateStatus ? helpMsg : undefined,
          errorColor: !!validateStatus ? this.props[`${validateStatus}Color`] : undefined,
        })}
      </View>
    );
  }
}
