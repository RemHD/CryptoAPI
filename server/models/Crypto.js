const db = require('../db');
const mongoose = require('mongoose');
const CryptoSchema = mongoose.Schema(
  {
  name: String,
  symbol: String,
  circulating_supply: Number,
  volume_24h: Number,
  price: Number
}, 
{ collection: 'crypto_currencies' }
);
const Crypto = db.model('crypto_currencies', CryptoSchema);
module.exports = Crypto;