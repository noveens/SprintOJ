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

var score = [0.0,0.0,0.0];

var totalScore = 0;

var oldScores;

var Upload=0;

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
 		   
 		   fd.append('name','grasshopper');


           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           })
 
           .success(function(data){

            if(data == "No files were uploaded."){
              
              localStorage.setItem("messageOstap",'Please upload a file to continue');
              
            }
            else{
               localStorage.setItem("messageOstap",'');
           		for(i=0;i<data.length;i++){
                  
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
              if(verdict[0]==1){document.getElementById("testCase1").src="greenTick.jpg";score[0]=33.3;}
              else{document.getElementById("testCase1").src="redCross.png";score[0]=0.0;}
              if(verdict[1]==1){document.getElementById("testCase2").src="greenTick.jpg";score[1]=33.3;}
              else{document.getElementById("testCase2").src="redCross.png";score[1]=0.0;}
              if(verdict[2]==1){document.getElementById("testCase3").src="greenTick.jpg";score[2]=33.3;}
              else{document.getElementById("testCase3").src="redCross.png";score[2]=0.0;}
              totalScore = score[0] + score[1] + score[2];
              if(totalScore == 99.89999999999999){totalScore=100;}
              document.getElementById('score1').innerHTML=score[0];document.getElementById('score2').innerHTML=score[1];document.getElementById('score3').innerHTML=score[2];document.getElementById('totalM').innerHTML='Your total score is : ' + totalScore;
              smoothScroll(document.getElementById('second'));



///////////////////// cheking score to send to api addScore to update score/////////////
              if(verdict[0]+verdict[1]+verdict[2] > oldScores[1]+oldScores[2]+oldScores[3]){
                var link = '/addScore?name='+localStorage.getItem('storageName')+'&ques=power&str='+verdict[0].toString()+verdict[1].toString()+verdict[2].toString();
                $http.get(link)
                .success(function(response){
                  
                });
              }

              if(oldScores == 0){
               var link = '/addScore?name='+localStorage.getItem('storageName')+'&ques=grasshopper&str=000';
                $http.get(link)
                .success(function(response){
                  
                }); 
              }
 
////////////////////////////////////////////////////////////////////////////////////////

           }})
 

         
           .error(function(){
           });



        }
     }]);
 
     myApp.controller('ProjectController', ['$scope', '$http','fileUpload', function($scope, $http,fileUpload){
        $scope.uploadFile = function(){
           var file = $scope.myFile;
           var uploadUrl = "/upload";
           fileUpload.uploadFileToUrl(file, uploadUrl);
           $scope.messageOstap = localStorage.getItem('messageOstap');
           
        };

         $scope.getStatus = function(){

          $http.get('/getScore?name='+localStorage.getItem("storageName")+'&ques=grasshopper')
          .success(function(response){
            oldScores = response;
            if(response==0){document.getElementById('sotap').src="na.png";$scope.score=0.0;}
            else if(response[1]==0 && response[2]==0 & response[3]==0){document.getElementById('ostap').src="redCross.png";$scope.score=0.0;}
            else if(response[1]==1 && response[2]==1 & response[3]==1){document.getElementById('ostap').src="greenTick.jpg";$scope.score=100;}
            else{document.getElementById('ostap').src="alert.png";if(response[1]+response[2]+response[3]==1){$scope.score=33.3}else{$scope.score=66.6}}
          })
          ;

        };
        $scope.getStatus();


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