const express = require('express');
const https = require('https');

const router = express.Router();
const Crypto = require('../models/Crypto');
var request = require("request");
const rp = require('request-promise');

router.get('/', (req, res) => {
    Crypto.find().then(data => res.json(data));
});

router.get('/updateCMCData', (req, res) => {

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
        json: true,
        gzip: true
        };
    
        rp(requestOptions).then(response => {
            const cryptos = response.data.map(item => {
               return {
                 name: item.name,
                 symbol: item.symbol,
                 circulating_supply: item.circulating_supply,
                 volume_24h: item.quote.USD.volume_24h,
                 price: item.quote.USD.price
               };
            });
            cryptos.forEach(crypto => {
               const model = new Crypto(crypto);
               model.save().then(crypto => res.status(201).json(crypto))
               .catch(error => {
                 if(error.name === "ValidationError") {
                   res.status(400).json(error.errors);
                 } else {
                   res.sendStatus(500);
                 }
               });
            });
        }).catch((err) => {
        console.log('API call error:', err.message);
        });
  });


  router.get('/updateCGData', (req, res) => {

    var options = {
    method: 'GET',
    url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false',
    headers: {
        'x-rapidapi-host': 'coingecko.p.rapidapi.com',
        'x-rapidapi-key': '70e29ef25bmsh5f52a46facab197p1a4b19jsn7cad646e9371'
    },
    json: true,
    gzip: true
    };

    
    rp(options).then(response => {
        const cryptos = response.map(item => {
           return {
            name: item.name,
            symbol: item.symbol,
            circulating_supply: item.circulating_supply,
            total_volume: item.total_volume,
            current_price: item.current_price,
            last_updated: item.last_updated
           };
        });
        cryptos.forEach(crypto => {
           const model = new Crypto(crypto);
           model.save().then(crypto => res.status(201).json(crypto))
           .catch(error => {
             if(error.name === "ValidationError") {
               response.status(400).json(error.errors);
             } else {
               response.sendStatus(500);
             }
           });
        });
    }).catch((error) => {
    console.log('API call error:', error.message);
    });

});

module.exports = router;
