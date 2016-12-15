var Logmain=angular.module('ProjectApp',[]);

Logmain.controller('ProjectController', function($scope, $http){
	var uname, pass, sign_name, sign_pass, sign_re_pass;
	$scope.message = "";
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
});