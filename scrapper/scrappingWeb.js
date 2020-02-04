const http = require('http');
const https = require('https');
const Post = require('./models/Post');
const cheerio = require('cheerio');

const url = "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP";

const config = {method: "GET"};

const req = https.request(url, config, function(res) {
   console.log('Status code: ' + res.statusCode);
   let data = "";
   res.on('data', function(chunk) {
      data += chunk;
   });

   res.on('end', function() {
      const $ = cheerio.load(data);

      const rows = $('table:first-of-type tbody tr');
      let result = [];
      rows.each(function(index, row) {
         const rowData = $(row).find('th,td').map(function() {
            return $(this).text().trim();
         }).get()
         result.push({code: rowData[0], title: rowData[1]});
      });
      result.forEach(post => {
         const model = new Post(post);
         model.save().catch(e => console.log(e));
      });
   });
});

req.end();