'use strict';
var fs = require('fs');
var request = require('request');

var content = fs.readFileSync('data/bfdump_eval.json');

var bfdump = JSON.parse(content);

for (var i in bfdump) {
  delete bfdump[i].id;
  request.post({url: 'http://localhost:3001/api/bfs/', 
                header: 'Content-Type: application/json', 
                json: bfdump[i]},
                function(err, res, body) { 
                if (err){
                    console.log(err);
                } else {
                    console.log(body.name);
                } 
                });
//                ).on('error', (err) => {
//                    console.error(err);
//                }).on('finish'), (res) => {
//                    console.log(i)
//                };
}
