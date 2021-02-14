<template>
  <div class="currency pa-5 pt-1">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="6">
            <v-icon color="green" left>mdi-arrow-up-bold</v-icon>
            <span class="green--text">{{ desserts.length - countDown }}</span>
            <span class="mx-5"></span>
            <v-icon color="red" left>mdi-arrow-down-bold</v-icon>
            <span class="red--text">{{ countDown }}</span>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              dense
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :loading="isLoading"
        loading-text="Loading..."
        :headers="headers"
        :items="desserts"
        :search="search"
        :hide-default-footer="false"
        :items-per-page="15"
      >
        <template v-slot:item.symbolA="{ item }">
          <div class="primary--text font-weight-bold-x text-h5">
            {{ item.symbolA }}
          </div>
        </template>
        <template v-slot:item.lastPrice="{ item }">
          <div :class="item.priceStatus == -1 ? 'red--text' : 'success--text'">
            <!-- {{item.priceStatus}} -->
            $ {{ item.lastPrice | price }}
          </div>
        </template>

        <template v-slot:item.lastPrice2="{ item }">
          <div :class="item.priceStatus == -1 ? 'red--text' : 'success--text'">
            ฿ {{ (item.lastPrice * usd) | price }}
          </div>
        </template>

        <template v-slot:item.priceChangePercent="{ item }">
          <v-chip
            small
            label
            text-color="white"
            :color="parseFloat(item.priceChangePercent) >= 0 ? 'green' : 'red'"
          >
            <v-icon v-if="parseFloat(item.priceChangePercent) >= 0" x-small left
              >mdi-arrow-up-bold</v-icon
            >
            <v-icon v-else x-small left>mdi-arrow-down-bold</v-icon>
            {{ item.priceChangePercent }} %
          </v-chip>
        </template>
        <template v-slot:item.highPrice="{ item }">
          <div class="success--text">$ {{ item.highPrice | price }}</div>
        </template>

        <template v-slot:item.lowPrice="{ item }">
          <div class="red--text">$ {{ item.lowPrice | price }}</div>
        </template>

        <template v-slot:item.volume="{ item }">
          <div class="grey--text">
            {{ item.volume | price }}
          </div>
        </template>

        <!-- <template v-slot:item.hit="{ item }">
          <div class="grey--text">
            {{item.hit}}
          </div>
        </template> -->

        <template v-slot:item.chart="{ item }">
          <v-sparkline
            :value="item.chart"
            :gradient="
              parseFloat(item.priceChangePercent) >= 0
                ? ['green', '#7fff00']
                : ['yellow', 'red']
            "
            :smooth="5"
            stroke-linecap="round"
            gradient-direction="top"
            type="trend"
            :fill="true"
          ></v-sparkline>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn
            small
            text
            color="primary"
            link
            target="_blank"
            :href="
              'https://www.binance.com/th/trade/' +
              item.symbolA +
              '_USDT?layout=pro&ref=ODBA01CZ'
            "
            title="เทรด"
          >
            <v-icon left>mdi-chart-areaspline</v-icon> เทรด
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- currency -->
    <!-- <v-row dense> -->
    <!-- md="4"
        xl="3"
        lg="2" -->
    <!-- <v-col cols="6" v-for="(currency, i) in currencys" :key="i"> -->
    <!-- <b href="https://www.w3schools.com" target="_blank"> -->
    <!-- <v-card
          class="pa-5"
          link
          :href="
            'https://www.binance.com/th/trade/' +
            currency.symbolA +
            '_USDT?layout=pro'
          "
          target="_blank"
        >
          <v-row dense class="text-center">
            <v-col cols="4" align-self="center">
              <div class="font-weight-medium primary--text">
                {{ currency.symbolA }}
              </div>
              <div>{{ currency.symbol }}</div>
            </v-col>
            <v-col cols="8">
              <v-row dense class="text-right">
                <v-col>
                  <div
                    class="font-weight-black"
                    :class="
                      currency.priceStatus == -1 ? 'red--text' : 'success--text'
                    "
                  >
                    $ {{ currency.price | price }}
                  </div>
                </v-col>
                <v-col>
                  <div class="font-weight-thin secondary--text">
                    ฿ {{ (currency.price * usd) | price }}
                  </div>
                </v-col>
                <v-col>
                  {{currency.priceChangePercent}} %
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card> -->

    <!-- </a>  -->

    <!-- </v-col> -->
    <!-- </v-row> -->
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
      currencys: [],
      tickers: [],
      connection: null,
      test: {
        value: [],
      },

      /* START: DATA TABLE */
      isLoading: true,
      search: "",
      headers: [
        {
          text: "เหรียญ",
          // align: "start",
          filterable: true,
          value: "symbolA",
          width: "150",
        },
        { text: "ราคา", value: "lastPrice" },
        { text: "บาท", value: "lastPrice2" },
        { text: "24H", value: "priceChangePercent", width: "50" },
        { text: "2 Day", value: "chart", width: "250", filterable: false },
        { text: "High", value: "highPrice", width: "110" },
        { text: "Low", value: "lowPrice", width: "110" },
        // { text: "Hit", value: "hit" },
        { text: "Volume", value: "volume", width: "120" },
        { text: "", value: "action" },
      ],
      desserts: [],
      /* END: DATA TABLE */
    };
  },
  mounted() {
    // this.getUSD();
    // this.getTrades();
    this.dailyStats();
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

    async dailyStats() {
      // const d = await this.$binance.trades({ symbol: 'ETHBTC' });
      const data = await this.$binance.dailyStats();
      // console.log("dailyStats", data);

      const usdtList = data
        .filter((t) => t.symbol.substr(t.symbol.length - 4) == "USDT")
        .map((t) => {
          return {
            symbolA: t.symbol.substring(t.symbol.length - 4, 0),
            symbolB: t.symbol.substr(-4),
            oldPrice: 0,
            chart: [],
            ...t,
          };
        });
      this.desserts = usdtList;
      this.isLoading = false;

      this.getCandles();
      this.streem();
    },

    async getCandles() {
      await this.desserts.forEach(async (t, i) => {
        const c = await this.$binance.candles({
          symbol: t.symbol, // "ETHUSDT",
          interval: "30m",
          limit: 96,
        });
        const list = c.map((d) => parseFloat(d.close));
        this.desserts[i].chart = list;
      });
    },

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
                hit: 0,
                chart: [],
              };
            });
          this.tickers = eth;
          // this.streem();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    streem() {
      this.connection = new WebSocket(
        `${this.$config.setting.wss}/ws/!ticker@arr`
        // `${this.$config.setting.wss}/ws/!miniTicker@arr`
      );

      this.connection.onmessage = (event) => {
        let tickers = JSON.parse(event.data);
        // console.log(tickers);
        // return;
        tickers = tickers.filter((t) => t.s.substr(t.s.length - 4) == "USDT");

        let currencys = this.desserts;

        tickers.forEach((t) => {
          currencys.forEach((g_ticker, g_i) => {
            if (t.s == g_ticker.symbol) {
              const oldPrice = parseFloat(currencys[g_i].lastPrice);

              if (oldPrice == parseFloat(t.c)) currencys[g_i].priceStatus = 0;
              else if (oldPrice < parseFloat(t.c))
                currencys[g_i].priceStatus = 1;
              else currencys[g_i].priceStatus = -1;

              // const oldHit = parseInt(currencys[g_i].hit);
              // let hit = 0;
              // if(currencys[g_i].priceStatus==1) {
              //   if(oldHit<0)
              //     hit = 1;
              //   else hit++;
              // }
              // else if(currencys[g_i].priceStatus==-1) {
              //   if(oldHit>0)
              //     hit = -1;
              //   else hit--;
              // }

              currencys[g_i].lastPrice = t.c;
              currencys[g_i].highPrice = t.h;
              currencys[g_i].lowPrice = t.l;
              currencys[g_i].priceChangePercent = t.P;
              // currencys[g_i].hit = hit;

              // console.log(this.tickers[g_i]);
            }
          });
        });

        this.desserts = currencys;
      };

      this.connection.onopen = (event) => {
        console.log("onopen", event);
        // console.log("Successfully connected to the echo websocket server...");
      };
    },
  },

  computed: {
    countDown() {
      const c = this.desserts.filter(
        (f) => parseFloat(f.priceChangePercent) < 0
      );
      return c.length;
    },
  },
};
</script>
