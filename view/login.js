var Logmain=angular.module('ProjectApp',[]);

Logmain.controller('ProjectController', function($scope, $http){
	var uname, pass, sign_name, sign_pass, sign_re_pass;
	$scope.send_data = function(username, password){
		uname = username;
		pass = password;
		var link = 'check?uname='+uname+'&pass='+pass;
		alert(link);
		$http.get(link)
		.success(function(response){
			alert(response);
			$scope.isCorrect = response;
		});
	};

	$scope.sign_in = function(username, password, re_password){
		sign_name = username;
		sign_pass = password;
		sign_re_pass = re_password;
		var link = 'newUser?uname='+sign_name+'&pass='+sign_pass;
		alert(link);
		$http.get(link)
		.success(function(response){
			alert(response);
			$scope.newLogin = response;
		});
	};
});