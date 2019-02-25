import React from 'react';
import PropTypes from 'prop-types';

import { Text, ScreenWrapper, FlatList, ListItem, TextInput } from '../../../common/components';

import Eth from '../components/Eth';
import Usd from '../components/Usd';

const WalletInfo = ({ price, wallet, walletExtraData }) => (
  <ScreenWrapper disableScroll>
    <FlatList
      data={buildData({ price, wallet, walletExtraData })}
      renderItem={({ item: { title, content } }) => <ListItem title={title}>{content}</ListItem>}
    />
  </ScreenWrapper>
);

WalletInfo.propTypes = {
  wallet: PropTypes.object.isRequired,
  walletExtraData: PropTypes.object.isRequired,
  price: PropTypes.number,
};

export default WalletInfo;

function buildData({ price, wallet, walletExtraData }) {
  const struct = {
    walletName: { title: 'Name', content: wallet.walletName },
    coin: { title: 'Coin', content: 'ETH' },
    network: { title: 'Network', content: wallet.network },
    balance: {
      title: 'Balance',
      content: (
        <Text>
          <Eth wei={walletExtraData.balance} /> <Usd price={price} wei={walletExtraData.balance} />
        </Text>
      ),
    },
    address: { title: 'Address', content: <TextInput value={wallet.address} /> },
    privateKey: { title: 'Private Key', content: <TextInput value={wallet.privateKey} /> },
  };

  return Object.entries(struct).map(([key, { title, content }]) => ({ key, title, content }));
}
