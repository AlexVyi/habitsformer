var app=angular.module('HabitsFormer', ["firebase", "ngRoute"]);

app.controller("RegisterController",["$scope", "$window", "$firebaseObject","$firebaseArray","$firebaseAuth", function($scope,$window, $firebaseObject,$firebaseArray, $firebaseAuth) {
  // download the data into a local object
  //$scope.data = $firebaseObject(ref);
  // putting a console.log here won't work, see below
  $scope.authObj = $firebaseAuth();


  $scope.Register=function(){
    if(!$scope.userName){
      swal("Error", "Please add a username", "error");
      return;
    }
    if($scope.password.length<=8){
      swal("Error", "Password needs to be over 8 characters long", "error");
      return;
    }
    if($scope.password!==$scope.confirmPassword){
      swal("Error", "Passwords do not match", "error");
      return;
    }
    try{
      $scope.authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
          firebaseUser.sendEmailVerification();
          var ref = firebase.database().ref("users/"+firebaseUser.uid);
          var firebaseObj= $firebaseObject(ref)
          firebaseObj.email=$scope.email
          firebaseObj.userName=$scope.userName;
          firebaseObj.points=0;
          firebaseObj.level=1;


          firebaseObj.$save().then(function(ref) {
            $window.location.href=cwd+"/MainPage.html";
          }, function(error) {
                swal("Error", "Registration failed", "error");
            });
        })
        .catch(function(error) {
          swal("Error", "Registration failed", "error");
        });
    }
    catch(err){
      console.log(err.message)
      if(err.message==="createUserWithEmailAndPassword failed: First argument \"email\" must be a valid string."){
        swal("Error", "Email can not be empty", "error");
      }
      else if(err.message==="createUserWithEmailAndPassword failed: Second argument \"password\" must be a valid string."){
        swal("Error", "Password can not be empty", "error");
      }
      else{
        swal("Error", "Registration failed", "error");
      }
    }
  }
}]);
