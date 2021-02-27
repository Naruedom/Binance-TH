const develop = {
  api: 'https://api1.binance.com',
  wss: 'wss://stream.binance.com:9443',

  // apiKey: 'vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A', // test
  // secretKey: 'NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j', // test

  // apiKey: 'M0l6Y5TsuqnT6VFX4239BjmsKbdKjldFKx4lw1a3h9dB89QReJPSbNJEUzteaPvJ',
  // secretKey: 'wYBhtvVPYBPVYRjlLFZ1555ZqoTXRRKFT7mclHCJKmsvSfpHz8GC5t9cun3tlPTT',

  apiKey: 'D9R4CNme3UZVQHED4hIDjuFVlYV9l7gj5UYvI9yNa8LjRzJgBjyb8VBtt7iKl734', // key 2
  secretKey: 'qHlyq5RsJGRMp1ndykI6jGCHxQLlx81aevgpJVMAM2K15sIkONW9X1Wdi5lRLdWx', // key 2s

  firebaseConfig: {
    apiKey: "AIzaSyAqACoKMUk_1zhmEMivtiNLwuTXHyrI05o",
    authDomain: "binance-th.firebaseapp.com",
    projectId: "binance-th",
    storageBucket: "binance-th.appspot.com",
    messagingSenderId: "142947551172",
    appId: "1:142947551172:web:ba0bce314e9285d2c48691",
    measurementId: "G-Q20J5KLND6"
  },
  functions: 'https://us-central1-binance-th.cloudfunctions.net'
  // functions: 'http://localhost:5001/binance-th/us-central1'

};

const varsion = process.env.VUE_APP_VERSION;

export default {
  varsion: varsion,
  isDebug: true,
  setting: develop
};

/*


Account information
/api/v3/account
 */