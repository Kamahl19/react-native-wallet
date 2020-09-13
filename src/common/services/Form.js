import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createRcForm from 'rc-form/lib/createForm';

export const FIELD_META_PROP = 'data-__meta';

// Docs - https://ant.design/components/form/#Form.create(options)
export default function createForm(options) {
  const formWrapper = createRcForm({
    fieldNameProp: 'id',
    fieldMetaProp: FIELD_META_PROP,
    ...options,
  });

  return (DecoratedComponent) =>
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

        getDOMFieldDecorator = this.props.form.getFieldDecorator;

        getRNFieldDecorator = (id, options) =>
          this.getDOMFieldDecorator(id, {
            trigger: 'onChangeText',
            validateTrigger: 'onChangeText',
            getValueFromEvent: (value) => value,
            ...options,
          });

        render() {
          this.props.form.getFieldDecorator = this.getRNFieldDecorator;

          return <DecoratedComponent {...this.props} />;
        }
      }
    );
}
