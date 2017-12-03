import React from 'react';

import { FormItem } from '../../common/services/Form';
import { getColor } from '../utils/color';

export default props => (
  <FormItem
    errorColor={getColor('red')}
    successColor={getColor('green')}
    validatingColor={getColor('gray')}
    {...props}
  />
);
