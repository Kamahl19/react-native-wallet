import React from 'react';

import { ScreenWrapper, CenterView, Text } from '../../../common/components';

const NoActiveWallet = () => (
  <ScreenWrapper scrollEnabled={false}>
    <CenterView>
      <Text>Please select a wallet</Text>
    </CenterView>
  </ScreenWrapper>
);

export default NoActiveWallet;
