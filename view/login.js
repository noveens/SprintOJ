var Logmain=angular.module('ProjectApp',[]);



var scoresAll;

Logmain.controller('ProjectController', function($scope, $http){
	
	$scope.isadmin="";
	$scope.display=[];
	$scope.Answers=[];
	var uname, pass, sign_name, sign_pass, sign_re_pass;
	$scope.message = "";
	$scope.Username = "";
	$scope.allS;


	$scope.send_data = function(username, password){
		uname = username;
		pass = password;
		
		var link = 'check?uname='+uname+'&pass='+pass;
		/*checked: alert(link); : true*/
		$http.get(link)
		.success(function(response){
			/*Checked : alert(response); : true*/
			$scope.isCorrect = response;
			if($scope.isCorrect == 2){
				
				$scope.Username = uname;
				
				localStorage.setItem("storageName",uname);
				
				window.location = "home.html";
			}
			else if ($scope.isCorrect == 1){
				$scope.message = "Login Failed! Please check your password.";
			}
			else{
				$scope.message = "Login Failed! Please check your username.";
			}

		});
		


	};



	$scope.sign_in = function(username, password, re_password){
		sign_name = username;
		sign_pass = password;
		sign_re_pass = re_password;
		if(sign_pass != sign_re_pass){
			$scope.message = ("Your passwords doesn't match. Please check.");
		}
		else{
			var link = 'newUser?uname='+sign_name+'&pass='+sign_pass;
			/*Checked : alert(link); : true*/
			$http.get(link)
			.success(function(response){
				/*Checked : alert(response); : true*/
				$scope.newLogin = response;
				if($scope.newLogin == 1){
					
					localStorage.setItem("storageName",sign_name);
					alert(localStorage.getItem("storageName"));
					window.location = "home.html";
				}
				else{
					$scope.message = "Sign-up Failed! Username with your name already exists."
				}
			});

		
		}
		
	};


	$scope.redirect = function(){
		window.location = 'signup.html';
	};


	$scope.getUserName = function(){
		var userLoggedIn = localStorage.getItem("storageName");
		var show="";

		$http.get('/isAdmin?name='+userLoggedIn)
		.success(function(response){
			console.log(response);
			$scope.isadmin=response;
			if(response=="1"){
				show="Admin requests !";
				var mydiv = document.getElementById("uploadQuest");
				var aTag = document.createElement('a');
				aTag.setAttribute('href',"uploadQuestion.html");
				aTag.innerHTML = "Upload Question";
				mydiv.appendChild(aTag);

				var mydiv2 = document.getElementById("admin2");
				var aTag2 = document.createElement('a');
				aTag2.setAttribute('href',"request.html");
				aTag2.innerHTML = show;
				mydiv2.appendChild(aTag2);

			}
			else {
				show="Become admin !";
				var mydiv3 = document.getElementById("admin2");
				var aTag3 = document.createElement('a');
				aTag3.setAttribute('href','#');
				
				aTag3.innerHTML = show;
				mydiv3.appendChild(aTag3);
			}
		});

		$scope.usernameLoggedIn = userLoggedIn;
		$scope.score=[0.0,0.0,0.0,0.0];
		
		$http.get('/getScore?name='+userLoggedIn)
		.success(function(response){
			$scope.Answers = response;
			console.log(response);
			if(response!=0){
				
				var x=0;
				for(i in response){
					
					if (response.hasOwnProperty(i)) {
						$scope.display.push({'ques':i,'id':x});
						x+=1;
					}
				}

						

				console.log($scope.display);
				
				for(i=0;i<response.length;i++){
					//console.log(response[i]);
/*					if(response["naive"][1]=='-'){document.getElementById('naive').src="na.png";}	
					else if(response["naive"][1]=='0' && response["naive"][2]=='0' && response["naive"][3]=='0'){document.getElementById('naive').src="redCross.png";$scope.score[0]=0.0;}
					else if(response["naive"][1]=='1' && response["naive"][2]=='1' && response["naive"][3]=='1'){document.getElementById('naive').src="greenTick.jpg";$scope.score[0]=100;}
					else{document.getElementById('naive').src="alert.png";if(Number(response['naive'][1])+Number(response['naive'][2])+Number(response['naive'][3])==1){$scope.score[0]=33.3}else{$scope.score[0]=66.6;}}
*/

				}	
				/*if(response["naive"][1]=='-'){document.getElementById('naive').src="na.png";}	
				else if(response["naive"][1]=='0' && response["naive"][2]=='0' && response["naive"][3]=='0'){document.getElementById('naive').src="redCross.png";$scope.score[0]=0.0;}
				else if(response["naive"][1]=='1' && response["naive"][2]=='1' && response["naive"][3]=='1'){document.getElementById('naive').src="greenTick.jpg";$scope.score[0]=100;}
				else{document.getElementById('naive').src="alert.png";if(Number(response['naive'][1])+Number(response['naive'][2])+Number(response['naive'][3])==1){$scope.score[0]=33.3}else{$scope.score[0]=66.6;}}

				if(response["power"][1]=='-'){document.getElementById('power').src="na.png";}
				else if(response["power"][1]==0 && response["power"][2]==0 && response["power"][3]==0){document.getElementById('power').src="redCross.png";$scope.score[1]=0.0;}
				else if(response["power"][1]==1 && response["power"][2]==1 && response["power"][3]==1){document.getElementById('power').src="greenTick.jpg";$scope.score[1]=100;}
				else{document.getElementById('power').src="alert.png";if(Number(response['power'][1])+Number(response['power'][2])+Number(response['power'][3])==1){$scope.score[1]=33.3}else{$scope.score[1]=66.6;}}

				if(response["chess"][1]=='-'){document.getElementById('aston').src="na.png";}
				else if(response["chess"][1]==0 && response["chess"][2]==0 && response["chess"][3]==0){document.getElementById('aston').src="redCross.png";$scope.score[2]=0.0;}
				else if(response["chess"][1]==1 && response["chess"][2]==1 && response["chess"][3]==1){document.getElementById('aston').src="greenTick.jpg";$scope.score[2]=100;}
				else{document.getElementById('aston').src="alert.png";if(Number(response['naive'][1])+Number(response['naive'][2])+Number(response['naive'][3])==1){$scope.score[0]=33.3}else{$scope.score[0]=66.6;}}

				if(response["grasshopper"][1]=='-'){document.getElementById('ostap').src="na.png";}
				else if(response["grasshopper"][1]==0 && response["grasshopper"][2]==0 && response["grasshopper"][3]==0){document.getElementById('ostap').src="redCross.png";$scope.score[3]=0.0;}
				else if(response["grasshopper"][1]==1 && response["grasshopper"][2]==1 && response["grasshopper"][3]==1){document.getElementById('ostap').src="greenTick.jpg";$scope.score[3]=100;}
				else{document.getElementById('ostap').src="alert.png";if(Number(response['ostap'][1])+Number(response['ostap'][2])+Number(response['ostap'][3])==1){$scope.score[3]=33.3}else{$scope.score[3]=66.6;}}*/
			
			}
			else{
//				alert('Hi');
				document.getElementById('naive').src="na.png";
				document.getElementById('aston').src="na.png";
				document.getElementById('ostap').src="na.png";
				document.getElementById('power').src="na.png";
			}
			console.log($scope.score);
		});
	};

	$scope.getUserName();


	$scope.get_scores = function(){
		$http.get('/allScore')
		.success(function(response){
			console.log(response);

			var dict = response;
			var items = Object.keys(dict).map(function(key) {
   				 return [key, dict[key]];


			});


			items.sort(function(first, second) {
			    return second[1] - first[1];
			});

			console.log(items[0]);
			$scope.allS = [];for(i=0;i<10;i++){$scope.allS.push(items[i]);}
			for(i=0;i<items.length;i++){
				if(items[i][0] == localStorage.getItem('storageName')){
					$scope.idex = i+1;
				}
			}
			$scope.id = "Id" + $scope.idex;


			for(i in $scope.Answers){
					console.log(i);
					if($scope.Answers[i][1]=='-'){document.getElementById(i).src="na.png";}	
					else if($scope.Answers[i][1]=='0' && $scope.Answers[i][2]=='0' && $scope.Answers[i][3]=='0'){document.getElementById(i).src="redCross.png";$scope.score[0]=0.0;}
					else if($scope.Answers[i][1]=='1' && $scope.Answers[i][2]=='1' && $scope.Answers[i][3]=='1'){document.getElementById(i).src="greenTick.jpg";$scope.score[0]=100;}
					else{document.getElementById(i).src="alert.png";if(Number($scope.Answers[i][1])+Number($scope.Answers[i][2])+Number($scope.Answers[i][3])==1){$scope.score[0]=33.3}else{$scope.score[0]=66.6;}}

			}		
		});
	};

	$scope.get_scores();


	$scope.getParams = function(Qname,Qbody,Qinp,Qout,Qi1,Qo1,Qi2,Qo2,Qi3,Qo3){
		if(Qname){var qname=Qname.replace(' ','%20')}

		if(Qbody){var qbody=Qbody.replace(' ','%20');}
		if(Qinp){var qinp=Qinp.replace(' ','%20');}
		if(Qout){var qout=Qout.replace(' ','%20');}
		if(Qi1){var qi1=Qi1.replace(' ','%20');}
		if(Qi2){var qi2=Qi2.replace(' ','%20');}
		if(Qi3){var qi3=Qi3.replace(' ','%20');}
		if(Qo1){var qo1=Qo1.replace(' ','%20');}
		if(Qo2){var qo2=Qo2.replace(' ','%20');}
		if(Qo3){var qo3=Qo3.replace(' ','%20');}
		
		if(Qbody){qbody=qbody.replace('\n','$20');}
		if(Qinp){qinp=qinp.replace('\n','$20');}
		if(Qout){qout=qout.replace('\n','$20');}
		if(Qi1){qi1=qi1.replace('\n','$20');}
		if(Qi2){qi2=qi2.replace('\n','$20');}
		if(Qi3){qi3=qi3.replace('\n','$20');}
		if(Qo1){qo1=qo1.replace('\n','$20');}
		if(Qo2){qo2=qo2.replace('\n','$20');}
		if(Qo2){qo3=qo3.replace('\n','$20');}

		var tc=qi1+','+qo1+";"+qi2+','+qo2+";"+qi3+','+qo3;
		var link='/createQues?text='+qbody+'&test='+tc+'&inform='+qinp+'&outform='+qout+'&name='+qname;
		$http.get(link)
		.success(function(response){
			console.log('Hi123');
			console.log(response);
			//alert(link);
		});

		$scope.createdMess="Question was successfully created!";
		console.log(qbody);

	};



	$scope.goTo = function(name){
			console.log(name);
            var link='questions/'+name+'/'+name+'.html';
            //alert(link);
            window.open(link);
        
	};

	$scope.getId = function(){
		console.log(document.getElementById('assignId'));
	};

	$scope.requested = function(){
		alert('Hurray');
		if($scope.isadmin==1){
			window.location="request.html";
		}
		else{
			$http.get('/requestAdmin?name='+localStorage.getItem("storageName"))
			.success(function(response){
				if(response==1){$scope.tell="Successfull request!";}
				else if(response==-1){$scope.tell="Already request was made!";}
				else if(response==0){$scope.tell="Unsuccessfull request!";}
			});
		}
	};



});