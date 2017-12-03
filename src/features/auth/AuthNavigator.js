import { StackNavigator } from 'react-navigation';

import { LoginContainer, SignUpContainer, ForgottenPasswordContainer } from './containers';

export default StackNavigator(
  {
    Login: { screen: LoginContainer },
    SignUp: { screen: SignUpContainer },
    ForgottenPassword: { screen: ForgottenPasswordContainer },
  },
  {
    initialRouteName: 'Login',
  }
);
