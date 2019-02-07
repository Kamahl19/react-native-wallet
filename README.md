# React Native Crypto Wallet

Simple mobile Bitcoin & Ethereum wallet

## Getting Started

Start the React Native

```sh
yarn install
react-native run-ios
```

## Hacks required to run Crypto on RN

- polyfill nodejs API using `node-libs-browser` and/or `node-libs-react-native` (missing the `vm` module) in `rn-cli.config.js`
- polyfill nodejs globals in `global.js`
- polyfill randomBytes using `react-native-randombytes` in `global.js`
- fix the `bitcore-lib` circular dependency using the `postinstall` script (RN Metro bundler works differently than webpack which can work around the circular dependency)
- relevant links:
  - https://github.com/tradle/rn-nodeify
  - https://github.com/tradle/react-native-crypto
  - https://github.com/mvayngrib/react-native-randombytes
  - https://github.com/webpack/node-libs-browser
  - https://github.com/parshap/node-libs-react-native
  - https://gist.github.com/parshap/e3063d9bf6058041b34b26b7166fd6bd
  - https://github.com/bitpay/bitcore-lib/issues/184
