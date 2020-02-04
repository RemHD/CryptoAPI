# Crypto API Groupe 5 - Quentin Becquart, Ritchie Elloumi
Nous avons décidé d'utiliser l'API de Coinmarketcap

## Setup
1. Cloner le repo
2. Installer les dépendances via ``npm install``
3. Depuis le folder ``docker-compose exec mongo mongorestore -u root -p password``

## Infrastructure
**app.js** : Appelle le back fait en node.js et reste sur écoute sur le port 3000
```javascript
const express = require('express');
const bodyparser = require('body-parser');
const movieRouter = require('./routes/movies');
const cryptoRouter = require('./routes/crypto');

const app = express();

app.use(bodyparser.json());

app.use('/movies', movieRouter);
app.use('/crypto', cryptoRouter);

app.listen(3000, () => console.log('Listening'));
```

**Crypto.js** : La "classe" ou le modèle qui décrit les champs de l'objet choisi, ici une crypto
```javascript
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
```

**crypto.js** : L'ensemble des routes (get & post) pour le modèle Crypto.js
```javascript
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
```

## Tests
Soit on utilise Postman et on effectue chacune des requêtes soit on utilise l'extension **Rest Client API**
```REST
GET http://localhost:3000/crypto/
```
