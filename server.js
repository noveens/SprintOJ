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

	fs.readFile('users.csv', function(err, data) {
		if(err) {
			console.log('some error occured!');
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
					console.log("new user logged in!");
					response.end("2");
				}
				else {
					console.log('some error occured!');
					response.end("1");
				}
			}

		}
		console.log('some error occured!');
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
			response.send("0");
			console.log('some error occured!');
		}

		var users = data.toString().split('\n');
		var n = users.length;
		var uname = request.query.uname;
		var pass = request.query.pass;

		if(uname == 'undefined') {
			console.log('some error occured!');
			response.end('0');
		}

		for(var i=0;i<n;i++) {
			var det = users[i].split(',');

			if(det[0] == uname) {
				fl = 1;
				console.log('some error occured!');
				response.end('0')
				break;
			}
		}

		if(fl == 0 && uname != 'undefined') {
			fs.appendFile('users.csv', uname+','+hashedPass+'\n', function(err) {
				if(err) {
					console.log('some error occured!');
					response.end('0');
				}
			});

			fs.readFile('score.csv', function(err, data) {
				if(err) {
					console.log('some error occured!');
					response.send("error!");
				}

				var scores = data.toString().split('\n')[0];

				var temp = scores.split(',');
				var send = "";
				var n = temp.length;

				for(var i=1;i<n;i++) {
					var a = temp[i].split(":")[0];
					var b = temp[i].split(":")[1].length;

					send += a + ":";
					while(b--) send +="-";
					if(i!=n-1) send +=",";
				}

				fs.appendFile('score.csv', uname+','+send+'\n', function(err) {
					if(err) {
						console.log('some error occured!');
						response.end('0');
					}
				});
			});

			console.log("new user registered!");
			response.end('1');
		}
	})
});

app.post("/upload", function(request, response) {
	var sampleFile;
 
    if (!request.files) {
        response.send('No files were uploaded.');
        return;
    }

    sampleFile = request.files.code;
    sampleFile.mv('./temp/code.cpp', function(err) {
        if (err) {
            response.status(500).send('some error occured!');
        }
        else {
        	var send = [];
        	var c = 0;
        	var name = request.body.name;
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
		console.log("testcase number " + num + " of question : " + name + " served!");
		response.end();
	})
});

app.get("/allScore", function(request, response) {
	fs.readFile('score.csv', function(err, data) {
		if(err) {
			response.send("error!");
		}

		var scores = data.toString().split('\n');
		var n = scores.length;

		var send = {};

		for(var i=0;i<n;i++) {
			var temp = scores[i].split(",");
			var s =0;
			for(var j=1;j<temp.length;j++) {
				var score = temp[j].split(':')[1];
				var c = 0;
				for(var k=0;k<score.length;k++) {
					if(score[k] == '1') c++;
				}
				s += 100 * (c/score.length);
			}
			send[temp[0]] = s;
		}

		response.send(send);
	});
});

app.get("/getScore", function(request, response) {
	var name = request.query.name;
	var ques = "";
	if(request.query.ques) {
		ques = request.query.ques;
	}

	fs.readFile('score.csv', function(err, data) {
		if(err) {
			response.send("error!");
		}

		var scores = data.toString().split('\n');
		var n = scores.length;

		if(name == 'undefined') {
			console.log('some error occured!');
			response.end('0');
		}

		var fl = 0;

		for(var i=0;i<n;i++) {

			var det = scores[i].split(',');
			if(det[0] == name) {
				fl = 1;

				if(ques) {
					//give array of scores of that ques;
					var n2 = det.length;
					var fll = 0;
					for(var j=1;j<n2;j++) {
						var qname = det[j].split(":")[0];
						var score = det[j].split(":")[1];

						if(qname == ques) {
							fll = 1;

							var send = {};
							for(var k=0;k<score.length;k++) {
								send[k+1] = score[k];
							}

							console.log("scores of ques " + ques + " served for user : " + name + " !");
							response.send(send);

							break;
						}
					}
					if(fll == 0) {
						console.log('some error occured!');
						response.end('0');
					}
				}
				else {
					// give all scores
					var n2 = det.length;
					var send = {};
					for(var j=1;j<n2;j++) {
						var qname = det[j].split(":")[0];
						var score = det[j].split(":")[1];

						var send2 = {};
						for(var k=0;k<score.length;k++) {
							send2[k+1] = score[k];
						}
						send[qname] = send2;
					}
					console.log("all scores served for user : " + name + " !");
					response.send(send);
				}

				break;
			}
		}

		if(fl == 0) {
			console.log('some error occured!');
			response.end('0');
		}
	})
});

app.get('/addScore', function(request, response) {
	var name = request.query.name;
	var str = request.query.str;
	var ques = request.query.ques;

	fs.readFile('score.csv', function(err, data) {
		if(err) {
			console.log('some error occured!');
			response.send("error!");
		}

		var scores = data.toString().split('\n');
		var n = scores.length;

		if(name == 'undefined') {
			console.log('some error occured!');
			response.end('0');
		}

		var fl = 0;
		var write = "";

		for(var i=0;i<n;i++) {
			var det = scores[i].split(',');
			if(det[0] == name) {
				fl = 1;
				var n2 = det.length;
				write += det[0];
				write += ",";
				for(var j=1;j<n2;j++) {
					var qname = det[j].split(':')[0];
					var marks = det[j].split(':')[1];

					if(qname == ques) {
						write = write + ques + ":" + str;
					}
					else {
						write = write + qname + ":" + marks;
					}

					if(j != n2-1) {
						write += ",";
					}
				}
				if(i != n-1) write += '\n';
			}
			else {
				write += scores[i];
				if(i != n-1) write += '\n';
			}
		}

		if(fl == 0) {
			console.log('some error occured!');
			response.end('0');
		}
		else {
			fs.writeFile("score.csv", write, function(err) {
				if(err) {
					console.log('some error occured!');
					response.send('0');
				}
				console.log("score of question " + ques + " changed to " + str + " for user : " + name + " !");
				response.send('1');
			})
		}
	});

});

var server = app.listen(3000, function() {
});