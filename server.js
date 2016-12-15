var express = require("express");
var fs = require("fs");
var passwordHash = require("password-hash");
var app = express();
app.use(express.static('view'));

app.get('/', function(request, response) {
	response.redirect("login.html")
});

app.get('/check', function(request, response) {
	console.log("request aa gayi!");

	fs.readFile('users.csv', function(err, data) {
		if(err) {
			response.send("error!");
		}

		var users = data.toString().split('\n');
		var n = users.length;
		var uname = request.query.uname;
		var pass = request.query.pass;

		for(var i=0;i<n;i++) {
			var det = users[i].split(',');

			if(det[0] == uname) {
				if( passwordHash.verify(pass, det[1]) == true ) {
					response.end("2");
				}
				else {
					response.end("1");
				}
			}

		}
		response.end("0");
	})
});

app.get('/newUser', function(request, response) {

	var uname = request.query.uname;
	var pass = request.query.pass;
	var hashedPass = passwordHash.generate(pass);
	var fl = 0;

	fs.readFile('users.csv', function(err, data) {
		if(err) {
			response.send("error!");
		}

		var users = data.toString().split('\n');
		var n = users.length;
		var uname = request.query.uname;
		var pass = request.query.pass;

		for(var i=0;i<n;i++) {
			var det = users[i].split(',');

			if(det[0] == uname) {
				fl = 1;
				response.end('0')
				break;
			}
		}

		if(fl == 0) {
			fs.appendFile('users.csv', uname+','+hashedPass+'\n', function(err) {
				if(err) {
					response.end('0');
				}
			});
			response.end('1');
		}
	})


});

var server = app.listen(3000, function() {
});