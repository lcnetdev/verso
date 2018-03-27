
var fs = require("fs");
var request = require("request");

var content = fs.readFileSync("data/bfdump.json");

var bfdump = JSON.parse(content)

for (var i in bfdump){ 
 delete bfdump[i].id 
 request.post({url:'http://mlvlp04.loc.gov:3000/verso/api/bfs', header:'Content-Type: application/json', json:bfdump[i]}, function(err, res, body){console.log(err);})
}
