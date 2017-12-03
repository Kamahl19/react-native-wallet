import React, { Component, PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import createRcForm from 'rc-form/lib/createForm';

import { View } from '../../common/components';

const FIELD_META_PROP = 'data-__meta';

// Docs - https://ant.design/components/form/#Form.create(options)
export const createForm = options => {
  const formWrapper = createRcForm({
    fieldNameProp: 'id',
    fieldMetaProp: FIELD_META_PROP,
    ...options,
  });

  return DecoratedComponent =>
    formWrapper(
      class Form extends Component {
        static propTypes = {
          form: PropTypes.object.isRequired,
        };

        static childContextTypes = {
          form: PropTypes.object.isRequired,
        };

        getChildContext() {
          return {
            form: this.props.form,
          };
        }

        componentWillMount() {
          this.getFieldDecorator = this.props.form.getFieldDecorator;
        }

        getRNFieldDecorator = (id, options) => {
          return this.getFieldDecorator(id, {
            trigger: 'onChangeText',
            validateTrigger: 'onChangeText',
            getValueFromEvent: value => value,
            ...options,
          });
        };

        render() {
          this.props.form.getFieldDecorator = this.getRNFieldDecorator;

          return <DecoratedComponent {...this.props} />;
        }
      }
    );
};

export class FormItem extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.any,
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
    const { style, children } = this.props;

    const validateStatus = this.getValidateStatus();
    const helpMsg = this.getHelpMsg();

    return (
      <View style={style}>
        {cloneElement(children, {
          error: !!validateStatus ? helpMsg : undefined,
          errorColor: !!validateStatus ? this.props[`${validateStatus}Color`] : undefined,
        })}
      </View>
    );
  }
}
