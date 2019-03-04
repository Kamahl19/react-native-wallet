// Inject node globals into React Native global scope
global.__dirname = typeof __dirname === 'undefined' ? '/' : __dirname;
global.__filename = typeof __filename === 'undefined' ? '' : __filename;
global.Buffer = typeof Buffer === 'undefined' ? require('buffer').Buffer : Buffer;

if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (let p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

// Polyfill getRandomValues()
const { randomBytes } = require('react-native-randombytes');
if (typeof window === 'object') {
  if (!window.crypto) window.crypto = {};
  if (!window.crypto.getRandomValues) {
    window.crypto.getRandomValues = function getRandomValues(arr) {
      let orig = arr;
      if (arr.byteLength !== arr.length) {
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
