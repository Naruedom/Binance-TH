const develop = {
  api: 'https://api1.binance.com',
  wss: 'wss://stream.binance.com:9443',
};

const varsion = process.env.VUE_APP_VERSION;

export default {
  varsion: varsion,
  isDebug: true,
  setting: develop
};
