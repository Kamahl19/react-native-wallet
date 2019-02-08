// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:',
};

// Some modules expect userAgent to be a string
global.navigator.userAgent = 'React Native';

const { randomBytes } = require('react-native-randombytes');

// implement window.getRandomValues()
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
