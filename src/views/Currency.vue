<template>
  <div class="currency pa-5">
    <!-- currency -->
    <v-row dense>
      <v-col
        cols="6"
        md="4"
        xl="3"
        lg="2"
        v-for="(ticker, i) in tickers"
        :key="i"
      >
        <!-- <b href="https://www.w3schools.com" target="_blank"> -->
        <v-card
          class="pa-5"
          link
          :href="
            'https://www.binance.com/th/trade/' +
            ticker.symbolA +
            '_USDT?layout=pro'
          "
          target="_blank"
        >
          <v-row dense class="text-center">
            <v-col cols="4" align-self="center">
              <div class="font-weight-medium primary--text">
                {{ ticker.symbolA }}
              </div>
              <!-- <div>{{ ticker.symbol }}</div> -->
            </v-col>
            <v-col cols="8">
              <v-row dense class="text-right">
                <v-col cols="12">
                  <div
                    class="font-weight-black"
                    :class="
                      ticker.priceStatus == -1 ? 'error--text' : 'success--text'
                    "
                  >
                    $ {{ ticker.price | price }}
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="font-weight-thin secondary--text">
                    ฿ {{ (ticker.price * usd) | price }}
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <!-- </a>  -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import Binance from "binance-api-node";

export default {
  name: "Currency",
  data() {
    return {
      usd: 30,
      exchanges: [],
      tickers: [],
      connection: null,
    };
  },
  mounted() {
    // this.getUSD();
    // this.getTrades();
    // this.getTicker();
    // this.getOpenOrders();
  },
  methods: {
    /* getUSD() {
      this.$http({
        method: "get",
        url: `https://api.bitkub.com/api/market/symbols`,
        // data: {symbol: "ETH"},
      })
    }, */

    getOpenOrders() {


      // const url = 'https://api.binance.com/api/v3/allOrders?symbol=ETHBTC&timestamp=1612509948544&signature=1e3cb6f02da48bc450ac7f2bdc83848fd50d576f125fffe3bdf1723f526a4dfc';
      // this.$http({
      //   method: "get",
      //   headers: { "X-MBX-APIKEY": this.$config.setting.apiKey },
      //   url: url,
      // })
      //   .then((res) => {
      //     console.log("res", res);
      //   })
      //   .catch((error) => {
      //     console.log("error", error);
      //   });

      // this.$binance
      //   .allOrders({ symbol: "ETHBTC" })
      //   .then((res) => {
      //     console.log("res", res);
      //   })
      //   .catch((error) => {
      //     console.log("error", error);
      //   });
    },

    getTicker() {

      // let client = Binance(
      //   {
      //     apiKey: this.$config.setting.apiKey,
      //     apiSecret: this.$config.setting.secretKey,
      //   }
      // );

      // client.ws.ticker('ETHBTC', ticker => {
      //   console.log('ticker',ticker)
      // })
    },

    getTrades() {
      this.$http({
        method: "get",
        url: `${this.$config.setting.api}/api/v3/ticker/price`,
        // data: {symbol: "ETH"},
      })
        .then((res) => {
          console.log("res", res);
          const eth = res.data
            .filter((t) => t.symbol.substr(t.symbol.length - 4) == "TUSD")
            .map((t) => {
              return {
                symbol: t.symbol,
                symbolA: t.symbol.substring(t.symbol.length - 4, 0),
                symbolB: t.symbol.substr(-4),
                price: t.price,
                high: "",
                low: "",
                priceStatus: 0,
              };
            });
          this.tickers = eth;
          this.streem();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    streem() {
      this.connection = new WebSocket(
        `${this.$config.setting.wss}/ws/!miniTicker@arr`
      );

      this.connection.onmessage = (event) => {
        let tickers = JSON.parse(event.data);

        tickers = tickers.filter((t) => t.s.substr(t.s.length - 4) == "TUSD");

        tickers.forEach((t) => {
          this.tickers.forEach((g_ticker, g_i) => {
            if (t.s == g_ticker.symbol) {
              const oldPrice = this.tickers[g_i].prict;

              if (oldPrice == t.c) this.tickers[g_i].priceStatus = 0;
              else if (oldPrice < t.c) this.tickers[g_i].priceStatus = 1;
              else this.tickers[g_i].priceStatus = -1;

              this.tickers[g_i].price = t.c;
              this.tickers[g_i].high = t.h;
              this.tickers[g_i].low = t.l;

              console.log(this.tickers[g_i]);
            }
          });
        });
      };

      this.connection.onopen = (event) => {
        console.log("onopen", event);
        // console.log("Successfully connected to the echo websocket server...");
      };
    },
  },
};
</script>
