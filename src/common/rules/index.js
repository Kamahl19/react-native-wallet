const required = { required: true, message: 'Field is required' };

const email = { type: 'email', message: 'E-mail is not valid' };

const password = { type: 'string', message: 'Password is not valid' };

const passwordWithLimit = [
  password,
  required,
  { min: 6, message: 'Password must contain at least 6 characters' },
];

const repeatPassword = form => [
  ...passwordWithLimit,
  {
    validator: function comparePasswords(form) {
      return (rule, value, cb) => {
        cb(
          value && value !== form.getFieldValue('password') ? 'Passwords do not match' : undefined
        );
      };
    },
  },
];

export default {
  required,
  email,
  password,
  passwordWithLimit,
  repeatPassword,
};
