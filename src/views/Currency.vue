<template>
  <div class="currency pa-5 pt-1">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" lg="4">
            <v-chip color="green" label class="mr-5">
              <v-icon color="white" left>mdi-arrow-up-bold</v-icon>
              <span class="white--text">{{ desserts.length - countDown }}</span>
            </v-chip>

            <v-chip color="red" label>
              <v-icon color="white" left>mdi-arrow-down-bold</v-icon>
              <span class="white--text">{{ countDown }}</span>
            </v-chip>
            
          </v-col>
          <v-col cols="12" lg="4">
            <small class="primary--text mr-5">Chart</small>
            <v-btn
              color="primary"
              :outlined="chart.type == '1H' ? false : true"
              class="black--text mr-2"
              x-small
              @click="getCandles('1m', 60, '1H')"
              >1H</v-btn
            >
            <v-btn
              color="primary"
              :outlined="chart.type == '6H' ? false : true"
              class="black--text mr-2"
              x-small
              @click="getCandles('5m', 72, '6H')"
              >6H</v-btn
            >
            <v-btn
              color="primary"
              :outlined="chart.type == '1D' ? false : true"
              class="black--text mr-2"
              x-small
              @click="getCandles('30m', 48, '1D')"
              >1D</v-btn
            >
            <v-btn
              color="primary"
              :outlined="chart.type == '2D' ? false : true"
              class="black--text mr-2"
              x-small
              @click="getCandles('30m', 96, '2D')"
              >2D</v-btn
            >
            <v-btn
              color="primary"
              :outlined="chart.type == '7D' ? false : true"
              class="black--text mr-2"
              x-small
              @click="getCandles('4h', 42, '7D')"
              >7D</v-btn
            >
            <v-btn
              color="primary"
              :outlined="chart.type == '1M' ? false : true"
              class="black--text mr-2"
              x-small
              @click="getCandles('12h', 60, '1M')"
              >1M</v-btn
            >
            <v-btn
              color="primary"
              :outlined="chart.type == '1Y' ? false : true"
              class="black--text mr-2"
              x-small
              @click="getCandles('1M', 12, '1Y')"
              >1Y</v-btn
            >
          </v-col>
          <v-col cols="12" lg="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              dense
              outlined
              color="primary"
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
        :items-per-page="50"
      >
        <template v-slot:item.symbolA="{ item }">
          <div class="primary--text font-weight-bold-x text-h5">
            {{ item.symbolA }}
          </div>
        </template>
        <template v-slot:item.lastPrice="{ item }">
          <div :class="item.priceStatus == -1 ? 'red--text' : 'success--text'" class="text-h6">
            <!-- {{item.priceStatus}} -->
            $ {{ item.lastPrice | price }}
          </div>
        </template>

        <template v-slot:item.lastPrice2="{ item }">
          <div :class="item.priceStatus == -1 ? 'red--text' : 'success--text'">
            ฿ {{ (item.lastPrice * usd) | price }}
          </div>
          <!-- <small><pre>{{item}}</pre></small> -->
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
                parseFloat(item.chart[item.chart.length - 1]) >=
                parseFloat(item.chart[0])
                  ? ['green', '#7fff00']
                  : ['yellow', 'red']
              "
              :smooth="5"
              stroke-linecap="round"
              gradient-direction="top"
              type="trend"
              :fill="true"
            ></v-sparkline>
            <div class="blue-grey--text darken-4 text-center" style="font-size:12px;">
              <small class="float-left">{{parseFloat(item.chart[0])| price}}</small>
              <v-chip :color="parseFloat(item.chart[item.chart.length - 1]) >= parseFloat(item.chart[0])?'green':'red'" x-small class="mb-1">
                {{parseInt(((parseFloat(item.chart[item.chart.length - 1]) - parseFloat(item.chart[0])) / parseFloat(item.chart[0])) * 100)}} %
              </v-chip>
              <small class="float-right">{{parseFloat(item.chart[item.chart.length - 1])| price}}</small>
            </div>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn
            text
            color="primary"
            link
            target="_blank"
            :href="
              'https://www.binance.com/th/trade/' +
              item.symbolA +
              '_USDT?layout=pro&ref=ODBA01CZ'
            "
            title="Chart"
          >
            <v-icon left>mdi-chart-areaspline</v-icon> Chart
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

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
      chart: {
        type: "1D",
        loading: true,
      },
      test: {
        value: [],
      },

      /* START: DATA TABLE */
      isLoading: true,
      search: "",
      headers: [
        {
          text: "NAME",
          // align: "start",
          filterable: true,
          value: "symbolA",
          width: "200",
        },
        { text: "PRICE", value: "lastPrice" },
        { text: "THB", value: "lastPrice2" },
        { text: "24H", value: "priceChangePercent" },
        { text: "", value: "chart", width: "200", filterable: false },
        { text: "HIGH", value: "highPrice" },
        { text: "LOW", value: "lowPrice" },
        // { text: "Hit", value: "hit" },
        { text: "Volume", value: "volume" },
        { text: "", value: "action", width: "50" },
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
        .filter(
          (t) =>
            t.symbol.substr(t.symbol.length - 4) == "USDT" &&
            parseFloat(t.askPrice) != 0 &&
            t.symbol.substr(t.symbol.length - 8) != "DOWNUSDT" &&
            t.symbol.substr(t.symbol.length - 6) != "UPUSDT"
        ) /* คัดเฉพาะ คู่เหรียญ usdt ที่ไม่ 404 */
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

      this.getCandles("30m", 48, "1D");
      this.streem();
    },

    async getCandles(interval, limit, type) {
      this.chart.loading = true;
      this.chart.type = type;
      await this.desserts.forEach(async (t, i) => {
        const c = await this.$binance.candles({
          symbol: t.symbol, // "ETHUSDT",
          interval,
          limit,
        });
        const list = c.map((d) => parseFloat(d.close));
        this.desserts[i].chart = list;
      });
      this.chart.loading = false;
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
