var express = require("express");

var app = express();

app.use(express.static('view'));

app.get('/', function(request, response) {
	response.redirect("login.html")
});

app.get('/check', function(request, response) {
	console.log("request aa gayi!");
});

var server = app.listen(3000, function() {
	//console.log("User++");
});