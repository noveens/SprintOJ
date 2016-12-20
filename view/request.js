var Logmain=angular.module('ProjectApp',[]);

Logmain.controller('ProjectController', function($scope, $http){

	$scope.getReq = function(){
		$http.get('/getRequestAdmin?name')
		.success(function(response){
			$scope.adminReq=[];
			for(i=0;i<response.length-1;i++){$scope.adminReq.push(response[i]);}
			console.log(response.length);
			if(response.length==1){
				document.getElementById('noOne').innerHTML=('<b>Hooooooorrrrrrrraaaaaaaaaay .. No more requests left</b>');
			}
		});
	}

	$scope.getReq();

	$scope.clickedApprove = function(name){
		$http.get('/makeAdmin?name='+name)
		.success(function(response){
			console.log(response);
			window.location.reload();
		});
	}


	$scope.clickedCancel = function(name){
		$http.get('/removeAdminRequest?name='+name)
		.success(function(response){
			console.log(response);
			window.location.reload();
		});
	}

});