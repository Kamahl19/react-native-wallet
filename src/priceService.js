import cryptocompare from 'cryptocompare';

/**
 * Get prices
 * @param {array} fromCoins
 * @param {array} toCoins
 */
export async function getPrices(fromCoins, toCoins) {
  return await cryptocompare.priceMulti(fromCoins, toCoins);
}
