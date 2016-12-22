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


		var userLoggedIn=localStorage.getItem("storageName");
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