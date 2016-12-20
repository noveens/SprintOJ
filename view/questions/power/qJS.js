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

var score = [0.0 ,0.0,0.0];

var Upload=0;

var oldScores;

var totalScore = 0;

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

            console.log(data);
            if(data == "No files were uploaded."){
              localStorage.setItem("messagePower",'Please upload a file to continue');

            }
            else{
              localStorage.setItem("messagePower",'');
              console.log(data)
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
              console.log(verdict);
              var s='',o='';
              for(i=0;i<3;i++){
                var idL="testCase"+Number(i+1);
                console.log(idL);
                if(verdict[i]=='1'){document.getElementById("testCase"+Number(i+1)).src="greenTick.jpg";score[i]=33.3;}
                else{document.getElementById("testCase"+Number(i+1)).src="redCross.png";score[i]=0.0;}
                document.getElementById('score'+Number(i+1)).innerHTML=score[i];
                totalScore+=score[i];
                s+=verdict[i];
                o+=oldScores[i];
              }

              /*if(verdict[0]=='1'){document.getElementById("testCase1").src="greenTick.jpg";score[0]=33.3;}
              else{document.getElementById("testCase1").src="redCross.png";score[0]=0.0;}
              if(verdict[1]=='1'){document.getElementById("testCase2").src="greenTick.jpg";score[1]=33.3;}
              else{document.getElementById("testCase2").src="redCross.png";score[1]=0.0;}
              if(verdict[2]=='1'){document.getElementById("testCase3").src="greenTick.jpg";score[2]=33.3;}
              else{document.getElementById("testCase3").src="redCross.png";score[2]=0.0;}*/
              /*totalScore = score[0] + score[1] + score[2];*/
              if(totalScore == 99.89999999999999){totalScore=100;}
              /*document.getElementById('score1').innerHTML=score[0];document.getElementById('score2').innerHTML=score[1];document.getElementById('score3').innerHTML=score[2];document.getElementById('totalM').innerHTML='Your total score is : ' + totalScore;*/
              smoothScroll(document.getElementById('second'));

///////////////////// cheking score to send to api addScore to update score/////////////
              
              
              if(Number((s.match(/1/g) || []).length) > Number((o.match(/1/g) || []).length)){
                var link = '/addScore?name='+localStorage.getItem('storageName')+'&ques=power&str='+s;
                $http.get(link)
                .success(function(response){
                  
                });
              }

              else if(oldScores[1]=='-'){
               var link = '/addScore?name='+localStorage.getItem('storageName')+'&ques=power&str='+s;
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
      $scope.language="";
        $scope.uploadFile = function(){
           var file = $scope.myFile;
           var uploadUrl = "/upload?lang="+$scope.language;
            if(file!=undefined){
              var fileName = file.name;
              var ext = fileName.split('.').pop();
              if(ext == "c" || ext == "cpp"){
                fileUpload.uploadFileToUrl(file, uploadUrl);
                $scope.messagePower='';
              }else{$scope.messagePower='You can only submit .c or .cpp files.'}
            }
            else{
              $scope.messagePower='Please upload a file to continue'; 
            }
        };


         $scope.getStatus = function(){
          var userLoggedIn = localStorage.getItem("storageName");
          $http.get('/getScore?name='+localStorage.getItem("storageName")+'&ques=power')
          .success(function(response){
            console.log(response);
            console.log(localStorage.getItem("storageName"))
            oldScores = response;
            if(response[1]=='-'){document.getElementById('power').src="na.png";$scope.score=0.0;}
            else if(response[1]=='0' && response[2]=='0' & response[3]=='0'){document.getElementById('power').src="redCross.png";$scope.score=0.0;}
            else if(response[1]=='1' && response[2]=='1' & response[3]=='1'){document.getElementById('power').src="greenTick.jpg";$scope.score=100;}
            else{document.getElementById('power').src="alert.png";if(Number(response[1])+Number(response[2])+Number(response[3])==1){$scope.score=33.3}else{$scope.score=66.6}}
          })
          ;
        };
        $scope.getStatus();


        
        $scope.getTop = function(){
          $http.get('/getScoreQues?qname=power')
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
              $scope.allS = [];
              for(i=0;i<10 && i<items.length;i++){
                $scope.allS.push(items[i]);
              }
              for(i=0;i<items.length;i++){
                if(items[i][0] == localStorage.getItem('storageName')){
                  $scope.idex = i+1;
                }
              }
              $scope.id = "Id" + $scope.idex;
          });
        }

        $scope.getTop();
        
        $scope.ProgC = function(){
          $scope.language = "C";
        };

        $scope.ProgCpp = function(){
          $scope.language = "C++";
        };

         $scope.ProgJava = function(){
          $scope.language = "Java";
        };

        $scope.ProgPy = function(){
          $scope.language = "Python";
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