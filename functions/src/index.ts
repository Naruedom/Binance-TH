import * as admin from 'firebase-admin';

const serviceAccount = require("../binance-th-firebase-adminsdk-ua761-a148e9624c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://share2change-dev.firebaseio.com"
});

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));
  
exports.api = require('./api').handler;