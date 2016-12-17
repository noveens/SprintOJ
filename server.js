var express = require("express");
var fs = require("fs");
var passwordHash = require("password-hash");
var fileUpload = require('express-fileupload');
var exec = require("child_process").exec;
var sys = require("sys");
var url = require("url");
var replace = require("replace");
var app = express();

app.use(express.static('view'));
app.use(fileUpload());



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
				if( passwordHash.verify(pass, det[2]) == true ) {
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

		if(uname == 'undefined') {
			response.end('0');
		}

		for(var i=0;i<n;i++) {
			var det = users[i].split(',');

			if(det[0] == uname) {
				fl = 1;
				response.end('0')
				break;
			}
		}

		if(fl == 0 && uname != 'undefined') {
			fs.appendFile('users.csv', uname+','+'0'+','+hashedPass+'\n', function(err) {
				if(err) {
					response.end('0');
				}
			});
			response.end('1');
		}
	})
});

app.post("/upload", function(request, response) {
	var sampleFile;
 
    if (!request.files) {
        response.send('Noooo files were uploaded.');
        return;
    }

    //url.parse(request.url, true);
 
    sampleFile = request.files.code;
    sampleFile.mv('./temp/code.cpp', function(err) {
        if (err) {
            response.status(500).send(err);
        }
        else {
        	var send = [];
        	var c = 0;
        	var name = request.body.name;
        	console.log("bash ./bash/script.sh " + name);
            for(var i=1;i<=3;i++) {
				exec("bash ./bash/script.sh " + name + " " + i, function puts(error, stdout, stderr) { 
					if(stdout[2] == "0") {
						var tt = {};
						tt[stdout[0]] = 1;
						send.push(tt);
					}
					else {
						var tt = {};
						tt[stdout[0]] = 0;
						send.push(tt);
					}
					c++;
					if(c == 3) {
						console.log("checking complete!");
		            	response.send(send);
					}
				});
	        }
        }
    });
});

app.get("/getTestcase", function(request, response) {
	var name = request.query.name;
	var num = request.query.num;

	var string = "./testcases/" + name + "/in_" + num;
	var temp = fs.createReadStream(string, {start: 0});
	
	temp.on("data", function(data) {
		response.write(data);
	})

	temp.on("end", function() {
		response.end();
	})
});

app.get("/getScore", function(request, response) {
	var name = request.query.name;

	fs.readFile('users.csv', function(err, data) {
		if(err) {
			response.send("error!");
		}

		var users = data.toString().split('\n');
		var n = users.length;

		if(name == 'undefined') {
			response.end(-1);
		}

		var fl = 0;

		for(var i=0;i<n;i++) {

			var det = users[i].split(',');
			if(det[0] == name) {
				fl = 1;
				response.end(det[1]);
				break;
			}
		}

		if(fl == 0) {
			response.end(-1);
		}
	})
});

app.get('/addScore', function(request, response) {
	var name = request.query.name;
	var add = request.query.add;

	/*replace({
	  regex: "foo",
	  replacement: "bar",
	  paths: ['.'],
	  recursive: true,
	  silent: true,
	});*/

	fs.readFile('users.csv', function(err, data) {
		if(err) {
			response.send("error!");
		}

		var users = data.toString().split('\n');
		var n = users.length;
		var fl = 0;

		if(name == 'undefined') {
			response.end('0');
		}

		for(var i=0;i<n;i++) {
			var det = users[i].split(',');

			if(det[0] == name) {
				var temp = Number(det[1]) + Number(add);
				var rep = det[0] + "," + det[1];
				var rep2 = det[0]+","+temp.toString();
				
				replace({
				  regex: rep,
				  replacement: rep2,
				  paths: ['./users.csv'],
				  recursive: false,
				  silent: true,
				});

				console.log("score of " + name + " changed by " + add + ", new score = " + temp);

				response.end('1');
				fl = 1;
				break;
			}
		}

		if(fl == 0) {
			response.end('0');
		}

		/*if(fl == 1 && uname != 'undefined') {
			fs.appendFile('users.csv', uname+','+hashedPass+','+'0'+'\n', function(err) {
				if(err) {
					response.end('0');
				}
			});
			response.end('1');
		}*/
	})

});

var server = app.listen(3000, function() {
});