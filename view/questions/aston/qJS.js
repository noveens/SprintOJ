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
var score = [0.0,0.0,0.0];

var totalScore = 0;

var Upload=0;

var oldScores;
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
 		   
 		   fd.append('name','chess');


           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           })
 
           .success(function(data){
            if(data == "No files were uploaded."){
               localStorage.setItem("messageAston",'Please upload a file to continue');
            }
            else{
              localStorage.setItem("messageAston",'');
           		//console.log(data);
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
              console.log(oldScores);
              if(verdict[0]=='1'){document.getElementById("testCase1").src="greenTick.jpg";score[0]=33.3;}
              else{document.getElementById("testCase1").src="redCross.png";score[0]=0.0;}
              if(verdict[1]=='1'){document.getElementById("testCase2").src="greenTick.jpg";score[1]=33.3;}
              else{document.getElementById("testCase2").src="redCross.png";score[1]=0.0;}
              if(verdict[2]=='1'){document.getElementById("testCase3").src="greenTick.jpg";score[2]=33.3;}
              else{document.getElementById("testCase3").src="redCross.png";score[2]=0.0;}
              totalScore = score[0] + score[1] + score[2];
              if(totalScore == 99.89999999999999){totalScore=100;}
              document.getElementById('score1').innerHTML=score[0];document.getElementById('score2').innerHTML=score[1];document.getElementById('score3').innerHTML=score[2];document.getElementById('totalM').innerHTML='Your total score is : ' + totalScore;
              smoothScroll(document.getElementById('second'));


///////////////////// cheking score to send to api addScore to update score/////////////

              if(Number(verdict[0])+Number(verdict[1])+Number(verdict[2]) > Number(oldScores[1])+Number(oldScores[2])+Number(oldScores[3])){
                var link = '/addScore?name='+localStorage.getItem('storageName')+'&ques=chess&str='+verdict[0].toString()+verdict[1].toString()+verdict[2].toString();
                $http.get(link)
                .success(function(response){
                  
                });
              }

              else if(oldScores[1] == '-'){
               var link = '/addScore?name='+localStorage.getItem('storageName')+'&ques=chess&str='+verdict[0].toString()+verdict[1].toString()+verdict[2].toString();
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
 
     myApp.controller('ProjectController', ['$scope', '$http', 'fileUpload', function($scope, $http,fileUpload){
        $scope.uploadFile = function(){
           var file = $scope.myFile;
           var uploadUrl = "/upload";
            if(file!=undefined){
              var fileName = file.name;
              var ext = fileName.split('.').pop();
              if(ext == "c" || ext == "cpp"){
                fileUpload.uploadFileToUrl(file, uploadUrl);
                $scope.messageAston='';
              }else{$scope.messageAston='You can only submit .c or .cpp files.'}
            }
            else{
              $scope.messageAston='Please upload a file to continue'; 
            }
          };

        $scope.getStatus = function(){
          $http.get('/getScore?name='+localStorage.getItem("storageName")+'&ques=chess')
          .success(function(response){
            oldScores = response;
            console.log(localStorage.getItem("storageName"));
            if(response[1]=='-'){document.getElementById('aston').src="na.png";$scope.score=0.0;}
            else if(response[1]=='0' && response[2]=='0' & response[3]=='0'){document.getElementById('aston').src="redCross.png";$scope.score=0.0;}
            else if(response[1]=='1' && response[2]=='1' & response[3]=='1'){document.getElementById('aston').src="greenTick.jpg";$scope.score=100;}
            else{document.getElementById('aston').src="alert.png";if(Number(response[1])+Number(response[2])+Number(response[3])==1){$scope.score=33.3}else{$scope.score=66.6}}
          })
          ;
        };
        $scope.getStatus();

        $scope.ProgC = function(){
          $scope.language = "C";
        };

        $scope.ProgCpp = function(){
          $scope.language = "C++";
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