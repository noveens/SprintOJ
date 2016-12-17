/*var myApp = angular.module('ProjectApp', []);
         
myApp.directive('fileModel', ['$parse', function ($parse) {
return {
        scope: {
            file: '='
        },
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var file = event.target.files[0];
                scope.file = file ? file : undefined;
                scope.$apply();
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', function ($http) {
this.uploadFileToUrl = function(file, uploadUrl){
   var fd = new FormData();
   fd.append('file', file);

   $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
   })

   .success(function(){
   })

   .error(function(){
   });
}
}]);

myApp.controller('ProjectController', ['$scope', '$http' ,'fileUpload', function($scope , $http, fileUpload){
	$scope.uploadFile = function(){
	   	var file = $scope.myFile;
	   

		var Indata = {name:'chess', code: $scope.myFile};

/*		$http.post('/upload', Indata)
		.success(function(response){
			console.log(response+'Aman');
		});
*/
	/*	$http({
			method: 'POST',
			url: '/upload',
			headers: {'Content-Type':'multipart/form-data'},
			data:{
				code: file,
				name:'chess'
			},
			transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
		})
		.success(function(){
			alert('hi')
		})
/*
		$http.post({
			url: "time.php",
			method: "POST",
			params: Indata
		})*/

/*
		console.log('file is ' );
	    console.dir(file);
	   
	    var uploadUrl = "../../upload";
	    fileUpload.uploadFileToUrl(file, uploadUrl);
	};
}]*///);*/
//*/

var verdict = [0,0,0];

var myApp = angular.module('ProjectApp', []);
 
     myApp.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
 
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);
 
     myApp.service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function(file, uploadUrl){
           var fd = new FormData();
           fd.append('code', file);
 		   
 		   fd.append('name','power');


           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           })
 
           .success(function(data){
           		for(i=0;i<data.length;i++){
                  console.log('Loop '+data[i][1]);
                  if(data[i][1] != undefined){
                    verdict[0]=data[i][1];
                  }
                  if(data[i][2] != undefined){
                    verdict[1]=data[i][2];
                  }
                  if(data[i][3] != undefined){
                    verdict[2]=data[i][3];
                  }
              }
              console.log('Verdict is =>'+verdict);
              if(verdict[0]==1){document.getElementById("testCase1").src="greenTick.jpg";}
              else{document.getElementById("testCase1").src="redCross.png";}
              if(verdict[1]==1){document.getElementById("testCase2").src="greenTick.jpg";}
              else{document.getElementById("testCase2").src="redCross.png";}
              if(verdict[2]==1){document.getElementById("testCase3").src="greenTick.jpg";}
              else{document.getElementById("testCase3").src="redCross.png";}
           })
 
           .error(function(){
           });
        }
     }]);
 
     myApp.controller('ProjectController', ['$scope', 'fileUpload', function($scope, fileUpload){
        $scope.uploadFile = function(){
           var file = $scope.myFile;
           var uploadUrl = "/upload";
           fileUpload.uploadFileToUrl(file, uploadUrl);
        };
     }]);


     window.smoothScroll = function(target) {
            $('#second').show();
            var scrollContainer = target;
            do { //find scroll container
                scrollContainer = scrollContainer.parentNode;
                if (!scrollContainer) return;
                scrollContainer.scrollTop += 1;
            } while (scrollContainer.scrollTop == 0);

            var targetY = 0;
            do { //find the top of target relatively to the container
                if (target == scrollContainer) break;
                targetY += target.offsetTop;
            } while (target = target.offsetParent);

            scroll = function(c, a, b, i) {
                i++; if (i > 30) return;
                c.scrollTop = a + (b - a) / 30 * i;
                setTimeout(function(){ scroll(c, a, b, i); }, 20);
            }
            // start scrolling
            scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
        }