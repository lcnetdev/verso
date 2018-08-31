'use strict';
var fs = require('fs');
var request = require('request');

var content = fs.readFileSync('data/bfdump8.json');

var bfdump = JSON.parse(content);

for (var i in bfdump) {
  //if (bfdump[i].id > 3119){
      delete bfdump[i].id;
      request.post({url: 'http://localhost:3000/verso/api/bfs/', 
                header: 'Content-Type: application/json', 
                json: bfdump[i]},
                function(err, res, body) { 
                if (err){
                    console.log("error:" + err);
                } else {                    
                    console.log(body.id);
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
