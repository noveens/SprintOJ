var Logmain=angular.module('ProjectApp',[]);

Logmain.controller('ProjectController', function($scope, $http){
	console.log($scope.User_name);
	var uname, pass;
	$scope.send_data = function(username, password){
		uname = username;
		pass = password;
		alert($scope.uname);
	};
	var user = $scope.uname;
	var pass = $scope.pass;
	var link = 'localhost:3000/check?uname='+user+'&pass='+pass;
	$http.get(link)
	.success(function(response){
		$scope.var = response;
	});
});