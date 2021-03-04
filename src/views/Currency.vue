<template>
  <div class="currency pa-5 pt-1">
    <v-row class="mb-2">
      <v-col cols="6">
        <v-chip color="green" label class="mr-5">
          <v-icon color="white" left>mdi-arrow-up-bold</v-icon>
          <span class="white--text">{{ desserts.length - countDown }}</span>
        </v-chip>

        <v-chip color="red" label>
          <v-icon color="white" left>mdi-arrow-down-bold</v-icon>
          <span class="white--text">{{ countDown }}</span>
        </v-chip>
      </v-col>
      <v-col cols="6" class="text-right">
        <FormProfile v-if="isLogin" />

        <v-btn
          v-if="!isLogin"
          color="primary"
          outlined
          type="button"
          @click="loginGoogle"
          >Google Login</v-btn
        >
        <v-btn v-else color="white" outlined @click="logout()">Logout</v-btn>
      </v-col>
    </v-row>
    <!-- <pre>{{ accountBNB }}</pre> -->
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" lg="9">
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
          <v-col cols="12" lg="3">
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
        :items="dessertsComputed"
        :search="search"
        :hide-default-footer="false"
        :items-per-page="50"
      >
        <template v-slot:item.symbolA="{ item }">
          <div class="primary--text font-weight-bold-x text-h5">
            <v-btn
              v-if="isLogin"
              icon
              :color="
                user && user.favorites && user.favorites.includes(item.symbol)
                  ? 'primary'
                  : 'grey'
              "
              @click="favorite(item.symbol)"
            >
              <v-icon>mdi-star</v-icon>
            </v-btn>
            {{ item.symbolA }}
          </div>
        </template>
        <template v-slot:item.lastPrice="{ item }">
          <div
            :class="item.priceStatus == -1 ? 'red--text' : 'success--text'"
            class="text-h6"
          >
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

        <!-- <template v-slot:item.volume="{ item }">
          <div class="grey--text">
            {{ item.volume | price }}
          </div>
        </template> -->

        <template v-slot:item.freePrice="{ item }">
          <div v-if="item.free > 0" class="text-right">
            <v-chip small text-color="black" color="primary">
              <span v-if="isET" class="mr-2">มึงมี</span>
              $ {{ item.freePrice | price }}
            </v-chip>
            <div class="primary--text text-right mr-2">
              <v-icon x-small color="primary">mdi-alpha-c-circle</v-icon>
              {{ item.free | price }}
            </div>
          </div>
        </template>

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
          <div
            class="blue-grey--text darken-4 text-center"
            style="font-size: 12px"
          >
            <small class="float-left">{{
              parseFloat(item.chart[0]) | price
            }}</small>
            <v-chip
              x-small
              class="mb-1"
              :color="
                parseFloat(item.chart[item.chart.length - 1]) >=
                parseFloat(item.chart[0])
                  ? 'green'
                  : 'red'
              "
            >
              {{ parseFloat(calChart(item.chart)).toFixed(2) }} %
            </v-chip>
            <small class="float-right">{{
              parseFloat(item.chart[item.chart.length - 1]) | price
            }}</small>
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
import FormProfile from "@/components/FormProfile";

export default {
  name: "Currency",
  components: { FormProfile },
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
        // { text: "Volume", value: "volume" },
        { text: "", value: "freePrice" },
        { text: "", value: "action", width: "50" },
      ],
      desserts: [],
      /* END: DATA TABLE */

      accountBNB: [],
    };
  },
  mounted() {
    this.dailyStats();
  },
  methods: {
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

      await this.getCandles("30m", 48, "1D");
      await this.streem();
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

    getTrades() {
      this.$http({
        method: "get",
        url: `${this.$config.setting.api}/api/v3/ticker/price`,
        // data: {symbol: "ETH"},
      })
        .then((res) => {
          // console.log("res", res);
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

              currencys[g_i].lastPrice = t.c;
              currencys[g_i].highPrice = t.h;
              currencys[g_i].lowPrice = t.l;
              currencys[g_i].priceChangePercent = t.P;
            }
          });
        });

        this.desserts = currencys;
      };

      this.connection.onopen = (event) => {
        // console.log("onopen", event);
      };
    },

    getAccountBNB() {
      this.$http({
        method: "get",
        url: `${this.$config.setting.functions}/api/account`,
        // data: {symbol: "ETH"},
      })
        .then((res) => {
          const data = res.data;
          // this.accountBNB = data.balances;
          this.accountBNB = data.balances.filter((d) => parseFloat(d.free) > 0);
          // console.log("res", res);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },

    getAccountFree(symbol) {
      let o = this.accountBNB.find((d) => d.asset == symbol);
      return o ? o.free : 0;
    },

    favorite(symbol) {
      let list = [...this.user.favorites];
      if (list.includes(symbol)) {
        const index = list.indexOf(symbol);
        if (index > -1) {
          list.splice(index, 1);
        }
      } else {
        list.push(symbol);
      }

      this.$db
        .collection("users")
        .doc(this.auth.uid)
        .update({ favorites: list })
        .then(() => {
          this.$store.dispatch("updateProfileData");
        });
    },

    calChart(d) {
      return parseFloat(
        ((parseFloat(d[d.length - 1]) - parseFloat(d[0])) / parseFloat(d[0])) *
          100
      );
    },

    loginGoogle() {
      this.$store.dispatch("userLoginGoogle");
    },

    logout() {
      this.$store.dispatch("userLogout");
    },
  },

  watch: {
    // whenever question changes, this function will run
    isLogin: function (newStatus, oldStatus) {
      // console.log("isLogin", newStatus, oldStatus);
      if (!oldStatus && newStatus) {
        this.getAccountBNB();
      } else if (oldStatus && !newStatus) {
        this.accountBNB = [];
      }
    },
  },

  computed: {
    countDown() {
      const c = this.desserts.filter(
        (f) => parseFloat(f.priceChangePercent) < 0
      );
      return c.length;
    },

    isLogin() {
      return this.$store.getters.isLogin;
    },

    isET() {
      this.isLogin && this.user.email == 'e@e.com';
    },

    auth() {
      return this.$store.getters.getUser;
    },

    user() {
      return this.$store.getters.getProfile;
    },

    dessertsComputed() {
      let set = this.desserts.map((d) => {
        // return { ...d, free: this.getAccountFree(d.symbolA) };
        let free = this.getAccountFree(d.symbolA);
        return { ...d, free, freePrice: free * d.lastPrice };
      });
      return set;
    },
  },
};
</script>
