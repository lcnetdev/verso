'use strict';
var fs = require('fs');
var request = require('requestretry');
var content;
if (process.argv[2]===undefined)
    process.exit()
else
    content = fs.readFileSync(process.argv[2]);

var bfdump = JSON.parse(content);

for (var i in bfdump) {
  //if (bfdump[i].id > 3119){
      delete bfdump[i].id;

      request.post({
            url: 'http://localhost:3001/verso/api/bfs/',
            maxAttempts: 3,
            retryDelay: 1000,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError,

//      request.post({url: 'http://localhost:3000/verso/api/bfs/', 
                header: 'Content-Type: application/json', 
                json: bfdump[i]},
                function(err, res, body) { 
                if (err){
                    console.log("error:" + err);
                } else if (res) {                    
                    console.log('Attempts:'+ res.attempts);
                } 
                });
//                ).on('error', (err) => {
//                    console.error(err);
//                }).on('finish'), (res) => {
//                    console.log(i)
//                };
   console.log(i) 
   //}
}
