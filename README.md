# React Native Crypto Wallet

Simple mobile Bitcoin & Ethereum wallet

## Getting Started

Start the React Native

```sh
yarn install
react-native run-ios
```

## Hacks required to run Crypto on RN

- polyfill NodeJS API using [node-libs-browser](https://github.com/webpack/node-libs-browser) and/or [node-libs-react-native](https://github.com/parshap/node-libs-react-native) in `rn-cli.config.js` via [extraNodeModules](https://facebook.github.io/metro/docs/en/configuration#extranodemodules) (NOTE: new RN versions have different structure, check the [docs](https://facebook.github.io/metro/docs/en/configuration#extranodemodules))
- polyfill NodeJS globals in `global.js` using edited version of [shims](https://github.com/tradle/rn-nodeify/blob/master/shim.js)
- polyfill randomBytes using [react-native-randombytes](https://github.com/mvayngrib/react-native-randombytes) in `global.js`
- fix the `bitcore-lib` [circular dependency](https://github.com/bitpay/bitcore-lib/issues/184) using the `postinstall` script (RN Metro bundler works differently than webpack which can work around the circular dependency)
- use [shims](https://docs.ethers.io/ethers.js/html/cookbook-react.html) for the `ethers.js` lib
- relevant links:
  - https://gist.github.com/parshap/e3063d9bf6058041b34b26b7166fd6bd

## Features

- Create wallet
  - testnet or livenet
- Show wallet info
  - balance in crypto & USD
  - private & public keys
  - derivation strategy, address type etc
- Send transaction
  - scan QRCode address
  - choose BTC fee
  - show calculated fee
- Generate address
  - show QRCode address
- List all addresses
  - explore address transactions
- Transactions history
  - sent & received
- Backup wallet
  - using mnemonic
  - export as JSON
- Restore wallet
  - using mnemonic
  - import from JSON

### 1. App Menu

![screenshot 2019-02-07 at 14 09 37](https://user-images.githubusercontent.com/38855190/52413908-22b8f400-2ae3-11e9-9bd7-ce15276414df.png)

### 2. Create Wallet

Start by creating your first wallet.

![screenshot 2019-02-07 at 14 09 56](https://user-images.githubusercontent.com/38855190/52413924-2ba9c580-2ae3-11e9-9eb5-5c7178d659b8.png)

### 3. Wallet Info

Check details of the created wallet.

![screenshot 2019-02-07 at 14 10 31](https://user-images.githubusercontent.com/38855190/52413947-3b290e80-2ae3-11e9-92f3-e155fb29c0af.png)

### 4. Generate addresses

Generate multiple public addresses for receiving coins.

![screenshot 2019-02-07 at 14 10 57](https://user-images.githubusercontent.com/38855190/52413996-5dbb2780-2ae3-11e9-86f7-e1077a089568.png)

### 5. Addresses

Check list of all generated public addresses.

![screenshot 2019-02-07 at 14 11 19](https://user-images.githubusercontent.com/38855190/52414038-788d9c00-2ae3-11e9-9bf6-43e8bbae5238.png)

### 6. Send Transaction

![screenshot 2019-02-07 at 14 11 40](https://user-images.githubusercontent.com/38855190/52414057-8511f480-2ae3-11e9-97d3-6fcfb52abda2.png)

### 7. Select active wallet

Switch between all available wallets.

![screenshot 2019-02-07 at 14 13 01](https://user-images.githubusercontent.com/38855190/52414075-95c26a80-2ae3-11e9-9658-d7599c9304e2.png)

### 8. Backup wallet

Export mnemonic or private key of your wallet.

![screenshot 2019-02-07 at 14 13 24](https://user-images.githubusercontent.com/38855190/52414092-a377f000-2ae3-11e9-8684-5f8eca19645f.png)

### 9. Restore wallet

Add wallet by mnemonic or .dat file.

![screenshot 2019-02-07 at 14 13 43](https://user-images.githubusercontent.com/38855190/52414127-be4a6480-2ae3-11e9-8474-6caa8258f6ba.png)
