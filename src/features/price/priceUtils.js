import cryptocompare from 'cryptocompare';

import { COINS, FIATS } from './constants';

export async function getPrices() {
  return await cryptocompare.priceMulti(COINS, FIATS);
}
