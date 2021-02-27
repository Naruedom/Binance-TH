import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

const express = require('express');
const cors = require('cors');
const app = express();
// const db = admin.firestore();
// const userRef = db.collection("users");
const Binance = require('binance-api-node').default

const client = Binance({
  apiKey: '',
  apiSecret: '',
})

app.use(cors({ origin: true }));

app.get('/', (req: any, res: any) => {
  return res.status(200).send('API GET working.');
});

app.get('/account', (req: any, res: any) => {
  client.accountInfo()
    .then((data: any) => { res.send(data) })
    .catch((err: any) => { res.send(err) })
});

app.get('/get-order', (req: any, res: any) => {
  client.getOrder(
    {
      symbol: req.body.symbol,
      orderId: req.body.orderId,
    }
  )
    .then((data: any) => { res.send(data) })
    .catch((err: any) => { res.send(err) })
});

app.get('/get-order-oco', (req: any, res: any) => {
  client.getOrderOco(
    {
      orderListId: req.body.orderListId,
    }
  )
    .then((data: any) => { res.send(data) })
    .catch((err: any) => { res.send(err) })
});

app.get('/get-orders', (req: any, res: any) => {
  client.allOrders(
    {
      symbol: req.body.symbol,
      orderId: req.body.orderId,
      limit: req.body.limit,
    }
  )
    .then((data: any) => { res.send(data) })
    .catch((err: any) => { res.send(err) })
});

app.get('/get-orders-oco', (req: any, res: any) => {
  client.allOrdersOCO(
    {
      timestamp: req.body.timestamp,
    }
  )
    .then((data: any) => { res.send(data) })
    .catch((err: any) => { res.send(err) })
});

app.get('/my-trades', (req: any, res: any) => {
  client.myTrades(
    {
      symbol: req.body.symbol,
    }
  )
    .then((data: any) => { res.send(data) })
    .catch((err: any) => { res.send(err) })
});

app.get('/trades-history', (req: any, res: any) => {
  client.tradesHistory(
    {
      symbol: req.body.symbol,
    }
  )
    .then((data: any) => { res.send(data) })
    .catch((err: any) => { res.send(err) })
});


exports.handler = functions.https.onRequest(app);