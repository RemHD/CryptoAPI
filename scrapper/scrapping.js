const http = require('http');
const https = require('https');
const Post = require('../server/models/Post');

const url = "https://9gag.com/v1/group-posts/group/default/type/trending";

const config = {method: "GET", headers: {accept: "application/json"}};

const req = https.request(url, config, function(res) {
   console.log('Status code: ' + res.statusCode);
   let data = "";
   res.on('data', function(chunk) {
      data += chunk;
   });

   res.on('end', function() {
      const result = JSON.parse(data);
      const posts = result.data.posts.map(item => {
         return {
           title: item.title,
           type: item.type
         };
      });
      posts.forEach(post => {
         const model = new Post(post);
         model.save().catch(e => console.log(e));
      });
   });
});

req.end();