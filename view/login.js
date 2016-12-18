var Logmain=angular.module('ProjectApp',[]);

var scoresAll;

Logmain.controller('ProjectController', function($scope, $http){
	
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
					
					localStorage.setItem("storageName",uname);

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
		$scope.usernameLoggedIn = userLoggedIn;
		$scope.score=[0.0,0.0,0.0,0.0];
		$http.get('/getScore?name='+userLoggedIn)
		.success(function(response){
			$scope.Answers = response;
			console.log(response + userLoggedIn);
			if(response["naive"][1]==0 && response["naive"][2]==0 && response["naive"][3]==0){document.getElementById('naive').src="redCross.png";$scope.score[0]=0.0;}
			else if(response["naive"][1]==1 && response["naive"][2]==1 && response["naive"][3]==1){document.getElementById('naive').src="greenTick.jpg";$scope.score[0]=100;}
			else{document.getElementById('naive').src="alert.png";if(response['naive'][1]+response['naive'][2]+response['naive'][3]==1){$scope.score[0]=33.3}else{$scope.score[0]=66.6;}}

			if(response["power"][1]==0 && response["power"][2]==0 && response["power"][3]==0){document.getElementById('power').src="redCross.png";$scope.score[1]=0.0;}
			else if(response["power"][1]==1 && response["power"][2]==1 && response["power"][3]==1){document.getElementById('power').src="greenTick.jpg";$scope.score[1]=100;}
			else{document.getElementById('power').src="alert.png";if(response['power'][1]+response['power'][2]+response['power'][3]==1){$scope.score[1]=33.3}else{$scope.score[1]=66.6;}}

			if(response["chess"][1]==0 && response["chess"][2]==0 && response["chess"][3]==0){document.getElementById('aston').src="redCross.png";$scope.score[2]=0.0;}
			else if(response["chess"][1]==1 && response["chess"][2]==1 && response["chess"][3]==1){document.getElementById('aston').src="greenTick.jpg";$scope.score[2]=100;}
			else{document.getElementById('aston').src="alert.png";if(response['naive'][1]+response['naive'][2]+response['naive'][3]==1){$scope.score[0]=33.3}else{$scope.score[0]=66.6;}}

			if(response["grasshopper"][1]==0 && response["grasshopper"][2]==0 && response["grasshopper"][3]==0){document.getElementById('ostap').src="redCross.png";$scope.score[3]=0.0;}
			else if(response["grasshopper"][1]==1 && response["grasshopper"][2]==1 && response["grasshopper"][3]==1){document.getElementById('ostap').src="greenTick.jpg";$scope.score[3]=100;}
			else{document.getElementById('ostap').src="alert.png";if(response['ostap'][1]+response['ostap'][2]+response['ostap'][3]==1){$scope.score[3]=33.3}else{$scope.score[3]=66.6;}}
			console.log($scope.score);
		});
	};

	$scope.getUserName();

});