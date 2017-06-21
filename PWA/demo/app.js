var express = require("express");
var app = express();

app.use(express.static("public"));

app.get("/say",function(req,res){
    res.send({data:"hello world!"});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});