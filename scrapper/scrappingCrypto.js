const http = require('http');
const https = require('https');

const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      'start': '1',
      'limit': '5000',
      'convert': 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': '2de81a53-a7ad-4538-b69b-2aae41b63efc'
    },
    json: true,
    gzip: true
  };

const req = https.request(requestOptions, function(res) {
   let data = "";
   res.on('data', function(chunk) {
      data += chunk;
   });

   res.on('end', function() {
      console.log();
   });
});

req.end();