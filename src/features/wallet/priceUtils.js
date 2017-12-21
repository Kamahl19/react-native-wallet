import cryptocompare from 'cryptocompare';

export async function getPrices() {
  return await cryptocompare.priceMulti(['BTC', 'BCH'], 'USD');
}
