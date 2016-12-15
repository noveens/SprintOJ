var Logmain=angular.module('ProjectApp',[]);

Logmain.controller('ProjectController', function($scope, $http){
	var uname, pass;
	$scope.send_data = function(username, password){
		uname = username;
		pass = password;
		var link = 'localhost:3000/check?uname='+uname+'&pass='+pass;
		alert(link);
		$http.get(link)
		.success(function(response){
			alert(response);
			$scope.var = response;
		});
	};
});