var Leader = angular.module('MyApp',[]);

Leader.controller('MyController',function($scope, $http){

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
			$scope.allS = items;
			for(i=0;i<items.length;i++){
				if(items[i][0] == localStorage.getItem('storageName')){
					$scope.idex = i+1;
				}
			}
			$scope.id = "Id" + $scope.idex;
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
	};

	$scope.get_scores();
});