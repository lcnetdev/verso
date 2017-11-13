var fs = require("fs");
var request = require("request");
var content = fs.readFileSync("bfdump.json");
var bfdump = JSON.parse(content)
for (var i in bfdump){
    console.log(i);
    delete bfdump[i].id
    request.post({url:'http://bibframe.org/bibliomata/verso/api/bfs', header:'Content-Type: application/json', json:bfdump[i]}, function(err, res, body){console.log("error");})
}
