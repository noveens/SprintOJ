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
						console.log('2:some error occured!');
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
	var lang = request.query.lang;
	var extension  = ".cpp";

    if (!request.files) {
        response.send('No files were uploaded.');
        return;
    }

    sampleFile = request.files.code;
    if(lang == "Java") extension = ".java";
    if(lang == "C++") extension = ".cpp";
    if(lang == "C") extension = ".c";
    if(lang == "Python") extension = ".py";

    console.log("shhfs");
    console.log(extension);
    sampleFile.mv('./temp/code'+ extension, function(err) {
        if (err) {
            response.status(500).send('some error occured!');
        }
        else {
        	var send = [];
        	var c = 0;
        	var name = request.body.name;
        	console.log("require");
        	console.log(name);
            for(var i=1;i<=3;i++) {
				exec("bash ./bash/script.sh " + name + " " + i + " " +extension, function puts(error, stdout, stderr) { 
					if(stdout[2] == "0") {

						console.log(stdout[0]);
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


app.get("/getScoreQues", function(request,response){
	var qname = request.query.qname;
	
	fs.readFile('score.csv', function(err, data) {
		if(err) {
			console.log('some error occured!');
			response.send("error!");
		}
	var mydata = data.toString().split('\n');
	console.log("leng is " + mydata.length);
	var score = [];
	for (var i = 0; i < mydata.length; i++) {
				var user;
				var it=-1;
				var req="none";
				var user = mydata[i].toString().split(',');
				var banda = user[0];
			//	console.log("banda" + " " + banda);
				for (var i = 0; i < user.length; i++) {
					it = user[i].search(qname);
					req = user[i];
					if(it!=-1) {
						//console.log(user[i]);
						break;
					}
				}
				if(req=="none") {
					console.log('some error occured!');
					response.send("error!");
					continue;

				}
				//it2 = qname.length;
				//console.log(it);
			    var req2 = req.toString().split(':');
				//console.log(req2);
				var corr = 0;
				for (var i = 0; i < req2[1].length; i++) {
					if(req2[1][i] == '1') corr++;
				}

				//console.log(corr);
				score.push([banda],[corr]);
				console.log("i is "+i);
				console.log("leng is " + mydata.length);
			
		}
		console.log(score);	
	});

});

app.get("/createQues", function(request, response) {
	var text = request.query.text;
	var test = request.query.test;
	var inform = request.query.inform;
	var outform = request.query.outform;
	var name = request.query.name;

	text = text.replace("%20", " ");
	text = text.replace("$20", "\n");
	test = test.replace("%20", " ");
	test = test.replace("$20", "\n");
	inform = inform.replace("%20", " ");
	inform = inform.replace("$20", "\n");
	outform = outform.replace("%20", " ");
	outform = outform.replace("$20", "\n");
	name = name.replace("%20", " ");

	var fl = 0;





	// checking fl considering number of testcases to be 3 change here if neccessary.





	exec("bash ./bash/script2.sh " + name.split(" ")[0], function puts(error, stdout, stderr) {

		if(error) {
			console.log(error);
			response.send('error');
		}

		fs.readFile('./score.csv', function(err, data) {
			if(err) {
				console.log(err);
				response.end("error");
			}

			var temp = data.toString().split("\n");
			var n = temp.length;
			var send = "";

			for(var i=0;i<n-1;i++) {
				var te = temp[i];
				te += "," + name.split(" ")[0] + ":---\n";
				send += te;
			}

			fs.writeFile('./score.csv', send, function(err) {
				if(err) {
					console.log(err);
					response.end("error");
				}
			})
		});
		
		fs.readFile('./temp/first.txt', function(err, data) {
			if(err) {
				console.log(err);
				response.send("error!");
			}

			var first = data.toString();
			first = first.replace("power", name.charAt(0).toUpperCase() + name.slice(1));
			
			var lines = text.split("\n");
			var n = lines.length;

			for(var i=0;i<n;i++) {
				first += "<div>" + lines[i] + "</div><br>";
			}

			first += "<div><b>Input</b><br><br>"

			lines = inform.split("\n");
			n = lines.length;

			for(var i=0;i<n;i++) {
				first += "<div>" + lines[i] + "</div>";
			}

			first += "<br><b>Output</b><br><br>";

			lines = outform.split("\n");
			n = lines.length;

			for(var i=0;i<n;i++) {
				first += "<div>" + lines[i] + "</div>";
			}

			first += "</div>" + "<br><div><b>Examples</b><br><br></div><div class=\"row\">";

			var samp = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><b>Input</b></div><div class=\"panel-body\">";
			var samp2 = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><b>Output</b></div><div class=\"panel-body\">"

			lines = test.split(";");
			n = lines.length;

			for(var i=1;i<=n;i++) {
				var inp = lines[i-1].split(",")[0];	
				var out = lines[i-1].split(",")[1];

				fs.writeFile("./testcases/" + name.split(" ")[0] +"/in_" + i.toString(), inp, function(err) {
					if(err) {
						console.log(err);
						response.send('error');
					}

					fl++;
					if(fl == 9) {
						response.send("1");
					}
				});

				fs.writeFile("./testcases/" + name.split(" ")[0] +"/out_" + i.toString(), out, function(err) {
					if(err) {
						console.log(err);
						response.send('error');
					}

					fl++;
					if(fl == 9) {
						response.send("1");
					}
				});

				first += samp + inp + "</div></div>" + samp2 + out + "</div></div>"; 
			}

			first += "</div></div>";

						
			fs.readFile('./temp/last.txt', function(err, data) {
				if(err) {
					console.log(err);
					response.send('error');
				}

				var end = data.toString();
				
				first += end;
				
				fs.readFile('./view/questions/power/qJS.js', function(err, data) {
					if(err) {
						console.log(err);
						response.send("error!");
					}

					var js = data.toString();
					
					js = js.split("power").join(name.split(" ")[0]);
					js = js.split("Power").join((name.charAt(0).toUpperCase() + name.slice(1)).split(" ")[0]);
					
					fs.writeFile("./view/questions/" + name.split(" ")[0] + "/" + "qJS.js", js, function(err) {
						if(err) {
							console.log(err);
							response.send('error');
						}

						fl++;
						if(fl == 9) {
							response.send("1");
						}
					});

					fl++;
					if(fl == 9) {
						response.send("1");
					}
				});

				first = first.split("aston").join(name.split(" ")[0]);
				first = first.split("Aston").join((name.charAt(0).toUpperCase() + name.slice(1)).split(" ")[0]);

				fs.writeFile("./view/questions/" + name.split(" ")[0] + "/" + name.split(" ")[0] + ".html", first, function(err) {
					if(err) {
						console.log(err);
						response.send('error');
					}

					fl++;
					if(fl == 9) {
						response.send("1");
					}
				});
			});
		});
	});
});

var server = app.listen(3000, function() {
});