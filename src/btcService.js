import cryptocompare from 'cryptocompare';

export async function getPrices(fromCoins, toCoins) {
  return await cryptocompare.priceMulti(fromCoins, toCoins);
}
