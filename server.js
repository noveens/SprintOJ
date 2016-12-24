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
				if( passwordHash.verify(pass, det[2]) == true ) {
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

					fs.appendFile('users.csv', uname+',0,'+hashedPass+'\n', function(err) {
						if(err) {
							console.log('some error occured!');
							response.end('0');
						}
						
						fs.appendFile('score_contests.csv', uname+'\n', function(err) {
							if(err) {
								console.log('some error occured!');
								response.end('0');
							}

							console.log("new user registered!");
							response.end('1');
						})
					});
				});
			});
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

    //console.log("shhfs");
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
app.get("/getProfile", function(request,response){
	var uname = request.query.uname;
	
	fs.readFile('score.csv', function(err, data) {
		if(err) {
			console.log('some error occured!');
			response.send("error!");
		}

		var mydata = data.toString().split('\n');
		var score={};

		for (var i = 0; i < mydata.length; i++) {
			if(mydata[i]) {
				var user = mydata[i].split(',');
				var banda = user[0];
				for (var j = 1; j < user.length; j++) 
				{
					var ques = user[j].split(":")[0];
					var sco = user[j].split(":")[1];
					if(banda == uname) {
						var c = 0;
						var dash = 0;
						for(var k=0;k<sco.length;k++) {
							if(sco[k] == '1') {
								c++;
							}
							else if(sco[k] == "-") {
								dash++;
							}
						}
						var temp = (c/sco.length) * 100;
						if(dash == 0) score[ques] = temp;
						else score[ques] = "-";
					}
				}
			}
		}
		response.send(score);
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
		var score = {};
		
		for (var i = 0; i < mydata.length; i++) {
			if(mydata[i]) {
				var user = mydata[i].split(',');
				var banda = user[0];

				for (var j = 1; j < user.length; j++) {
					var ques = user[j].split(":")[0];
					var sco = user[j].split(":")[1];
					
					if(ques == qname) {
						var c = 0;
						var dash = 0;
						for(var k=0;k<sco.length;k++) {
							if(sco[k] == '1') {
								c++;
							}
							else if(sco[k] == "-") {
								dash++;
							}
						}
						var temp = (c/sco.length) * 100;
						if(dash == 0) score[banda] = temp;
						break;
					}
				}
			}
		}

		console.log(score);	
		response.send(score);
	});

});

app.get("/createQues", function(request, response) {
	var text = request.query.text;
	var test = request.query.test;
	var inform = request.query.inform;
	var outform = request.query.outform;
	var name = request.query.name;
	var contestNum = "";
	var alpha = "";
	var dirName = "";

	if(request.query.contestNum) {
		contestNum = request.query.contestNum;
		alpha = request.query.alpha;
		dirName = contestNum + alpha;
	}

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





	exec("bash ./bash/script2.sh " + name.split(" ")[0] + " " + dirName, function puts(error, stdout, stderr) {

		if(error) {
			console.log(error);
			response.send('error');
		}

		if(dirName) {
			//
		}
		else {
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
		}
		
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

				var inii;

				if(dirName) {
					inii = dirName;
				}
				else {
					inii = name.split(" ")[0];
				}

				fs.writeFile("./testcases/" + inii +"/in_" + i.toString(), inp, function(err) {
					if(err) {
						console.log(err);
						response.send('error');
					}

					fl++;
					if(fl == 9) {
						response.send("1");
					}
				});

				fs.writeFile("./testcases/" + inii +"/out_" + i.toString(), out, function(err) {
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
					
					if(dirName) {
						fs.writeFile("./view/contests/" + dirName + "/" + "qJS.js", js, function(err) {
							if(err) {
								console.log(err);
								response.send('error');
							}

							fl++;
							if(fl == 9) {
								response.send("1");
							}
						});
					}

					else {
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
					}

					fl++;
					if(fl == 9) {
						response.send("1");
					}
				});

				first = first.split("aston").join(name.split(" ")[0]);
				first = first.split("Aston").join((name.charAt(0).toUpperCase() + name.slice(1)).split(" ")[0]);

				if(dirName) {
					fs.writeFile("./view/contests/" + dirName + "/" + dirName + ".html", first, function(err) {
						if(err) {
							console.log(err);
							response.send('error');
						}

						fl++;
						if(fl == 9) {
							response.send("1");
						}
					});
				}

				else {
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
				}
			});
		});
	});
});

app.get("/isAdmin", function(request, response) {
	var name = request.query.name;
	var fl = 0;

	fs.readFile("users.csv", function(err, data) {
		var users = data.toString().split("\n");
		var n = users.length;

		for(var i=0;i<n;i++) {
			var u = users[i].split(",");

			if(u[0] == name) {
				console.log("admin request recieved for " + name + " !");
				fl = 1;
				response.send(u[1]);
			}
		}

		if(fl == 0) {
			console.log("no username found : " + name + " !");
			response.end("-1");
		}
	});
});

app.get("/makeAdmin", function(request, response) {
	var name = request.query.name;

	fs.readFile("users.csv", function(err, data) {
		var users = data.toString().split("\n");
		var n = users.length;
		var fl = 0;
		var write = "";

		for(var i=0;i<n-1;i++) {
			var u = users[i].split(",");

			if(u[0] == name) {
				fl = 1;
				if(u[1] == '0') {
					write += u[0] + ",1," + u[2] + '\n';
				}
				else {
					fl = 0;
					write += users[i] + '\n';
				}
			}
			else {
				write += users[i] + '\n';
			}
		}

		fs.writeFile("users.csv", write, function(err) {
			if(err) {
				console.log("some error occured!");
				response.end('error!');
			}

			fs.readFile("requestAdmin.csv", function(err, data) {
				if(err) {
					console.log("some error occured!");
					response.end('error!');
				}

				var x = data.toString().split("\n");
				var xn = x.length;
				var wr = "";

				for(var i=0;i<xn-1;i++) {
					if(x[i] != name) {
						wr += x[i] + '\n';
					}
				}

				fs.writeFile("requestAdmin.csv", wr, function(err) {
					if(err) {
						console.log("some error occured!");
						response.send("error");
					}

					response.send(fl.toString());
				});
			});
		});
	});
});

app.get("/removeAdminRequest", function(request, response) {
	var name = request.query.name;

	fs.readFile("requestAdmin.csv", function(err, data) {
		var users = data.toString().split("\n");
		var n = users.length;
		var write = "";
		var fl = 0;

		for(var i=0;i<n-1;i++) {
			if(users[i] == name) {
				fl = 1;
			}
			else {
				write += users[i] + '\n';
			}
		}

		fs.writeFile("requestAdmin.csv", write, function(err) {
			if(err) {
				console.log("some error occured!");
				response.send("error");
			}

			response.send(fl.toString());
		})
	});
});

app.get("/requestAdmin", function(request, response) {
	var name = request.query.name;
	var fl = 0;

	fs.readFile("requestAdmin.csv", function(err, data) {
		var users = data.toString().split("\n");
		var n = users.length;

		for(var i=0;i<n;i++) {
			if(users[i] == name) {
				fl = 1;
			}
		}

		if(fl == 0) {
			fs.appendFile("requestAdmin.csv", name + "\n", function(err) {
				if(err) {
					response.end('0');
				}
				response.end('1');
			});
		}

		else {
			response.end('-1');
		}
	})

});

app.get("/getRequestAdmin", function(request, response) {
	fs.readFile("requestAdmin.csv", function(err, data) {
		if(err) {
			response.send(err);
		}

		response.send(data.toString().split('\n'));
	});
});

app.get("/getPendingContest", function(request,response) {
	fs.readFile("pendingContest.csv", function(err, data) {
		if(err) {
			response.send(err);
		}
		var data = data.toString().split('\n');
		response.send(data);
	});
});

app.get("/newContest", function(request, response) {
	var numQuestion = request.query.numQuestion;
	var startDate = request.query.startDate;
	var startTime = request.query.startTime;
	var duration = request.query.duration;
	var contestNum = request.query.contestNum;
	if(numQuestion && startTime && startDate && contestNum && duration)
	{

		fs.appendFile('pendingContest.csv', contestNum+','+startDate+','+startTime+','+duration+','+numQuestion+'\n', function(err) {
			if(err) {
				console.log('error = ' + err);
				response.end('error');
			}

			response.end('1');
		});
	}
	else
	{
		response.send("fields cannot be empty");
	}
});

app.get("/getContestNum", function(request, response) {
	fs.readFile('number.csv', function(err, data) {
		if(err) {
			console.log('error');
			response.end('error');
		}

		var num = data.toString();
		response.send(num);
	});
});

app.get("/addContestNum", function(request, response) {
	fs.readFile('number.csv', function(err, data) {
		if(err) {
			console.log('error');
			response.end('error');
		}

		var num = data.toString();

		fs.writeFile('number.csv', Number(num) + Number(1), function(err) {
			if(err) {
				console.log('error');
				response.end('error');
			}

			response.send('1');
		});
	});
});

app.post("/uploadContest", function(request, response) {
	var sampleFile;
	var lang = request.query.lang;
	var extension  = ".cpp";
	var hour = new Date().getHours();
	var min = new Date().getMinutes();

    if (!request.files) {
        response.send('No files were uploaded.');
        return;
    }

    sampleFile = request.files.code;
    if(lang == "Java") extension = ".java";
    if(lang == "C++") extension = ".cpp";
    if(lang == "C") extension = ".c";
    if(lang == "Python") extension = ".py";

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
						fs.readFile("./liveContest.csv", function(err, data) {
							var temp = data.toString().split(",")[2];
							var hour_c = temp.split(":")[0];
							var min_c = temp.split(":")[1];

							var score = Number((name[name.length-1].charCodeAt(0) - 64) * 500) -  
							Math.floor(
							(Number(0.005) * Number( (hour - hour_c)*60 + (min - min_c) )) * 
							(Number((name[name.length-1].charCodeAt(0) - 64) * 500))
							);

					    	console.log("current time; hours = " + Number(hour) + " , min = " + 
							Number(min) + " \ncontest time; hours = " + Number(hour_c) + " , min = " + 
							Number(min_c) + "\nscore = " + Number(score));

							var ttt = {};
							ttt['score'] = score;
							send.push(ttt);

							response.send(send);
						});
					}
				});
	        }
        }
    });
});

var port = process.env.PORT || 3000

var server = app.listen(port, function() {
});