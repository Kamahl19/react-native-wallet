// Inject node globals into React Native global scope
require('rn-nodeify/shim');

// Polyfill getRandomValues()
const { randomBytes } = require('react-native-randombytes');
if (typeof window === 'object') {
  if (!window.crypto) window.crypto = {};
  if (!window.crypto.getRandomValues) {
    window.crypto.getRandomValues = function getRandomValues(arr) {
      let orig = arr;
      if (arr.byteLength != arr.length) {
        // Get access to the underlying raw bytes
        arr = new Uint8Array(arr.buffer);
      }
      const bytes = randomBytes(arr.length);
      for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i];
      }

      return orig;
    };
  }
}

// Ethers.js shims - must be imported after randomBytes polyfill
require('ethers/dist/shims.js');
