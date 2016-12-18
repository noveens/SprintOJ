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

			console.log(items);
			$scope.allS = items;
		});
	};

	$scope.get_scores();
});