import React from 'react';
import PropTypes from 'prop-types';

import { Text, ScreenWrapper, FlatList, ListItem } from '../../../common/components';

import Btc from '../components/Btc';
import Usd from '../components/Usd';

const WalletInfo = ({ balance, price, wallet }) => (
  <ScreenWrapper disableScroll>
    <FlatList
      data={buildData({ balance, price, wallet })}
      renderItem={({ item: { title, content } }) => <ListItem title={title}>{content}</ListItem>}
    />
  </ScreenWrapper>
);

WalletInfo.propTypes = {
  balance: PropTypes.object,
  wallet: PropTypes.object.isRequired,
  price: PropTypes.number,
};

export default WalletInfo;

function buildData({ balance, price, wallet }) {
  const struct = {
    walletName: { title: 'Name', content: wallet.walletName },
    walletId: { title: 'ID', content: wallet.walletId },
    coin: { title: 'Coin', content: wallet.coin },
    network: { title: 'Network', content: wallet.network },
    addressType: { title: 'Address Type', content: wallet.addressType },
    derivationStrategy: { title: 'Derivation Strategy', content: wallet.derivationStrategy },
    xPubKey: { title: 'Extended Public Key', content: wallet.xPubKey },
    xPrivKey: { title: 'Extended Private Key', content: wallet.xPrivKey },
  };

  if (balance) {
    struct.total = {
      title: 'Total',
      content: (
        <Text>
          <Btc satoshi={balance.total} /> <Usd price={price} satoshi={balance.total} />
        </Text>
      ),
    };
    struct.available = {
      title: 'Available (immediately spendable)',
      content: (
        <Text>
          <Btc satoshi={balance.available} /> <Usd price={price} satoshi={balance.available} />
        </Text>
      ),
    };
    struct.confirming = {
      title: 'Confirming (with no confirmation)',
      content: (
        <Text>
          <Btc satoshi={balance.confirming} /> <Usd price={price} satoshi={balance.confirming} />
        </Text>
      ),
    };
    struct.locked = {
      title: 'Locked (inputs in pending transactions)',
      content: (
        <Text>
          <Btc satoshi={balance.locked} /> <Usd price={price} satoshi={balance.locked} />
        </Text>
      ),
    };
  }

  return Object.entries(struct).map(([key, { title, content }]) => ({ key, title, content }));
}
