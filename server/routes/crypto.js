const express = require('express');
const https = require('https');
const router = express.Router();
const Crypto = require('../models/Crypto');
const rp = require('request-promise');
router.get('/', (req, res) => {
    Crypto.find().then(data => res.json(data));
});
router.post('/updateData', (req, res) => {
    
    console.log("starting querying CM Api");
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': '1',
            'limit': '50',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': '2de81a53-a7ad-4538-b69b-2aae41b63efc'
        },
        json: true
        };
    
        rp(requestOptions).then(response => {
            const cryptos = response.data.map(item => {
               return {
                 name: item.name,
                 symbol: item.symbol,
                 circulating_supply: item.circulating_supply
                 //volume_24h: item.quote.USD.volume_24h,
                 //price: item.quote.USD.price
               };
            });
            cryptos.forEach(crypto => {
               const model = new Crypto(crypto);
               model.save().catch(e => console.log(e));
            });
        }).catch((err) => {
        console.log('API call error:', err.message);
        });
  });
module.exports = router;