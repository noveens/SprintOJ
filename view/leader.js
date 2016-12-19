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
	};

	$scope.get_scores();
});