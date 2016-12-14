var express = require("express");

var app = express();

app.use(express.static('view'));

app.get('/', function(request, response) {
	response.redirect("home.html")
});

var server = app.listen(3000, function() {
	//console.log("User++");
});