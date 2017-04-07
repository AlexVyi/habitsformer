var app=angular.module('HabitsFormer', ["firebase", "ngRoute"]);

app.controller("LoginController",["$scope", "$window", "$firebaseObject","$firebaseArray","$firebaseAuth", function($scope,$window, $firebaseObject,$firebaseArray, $firebaseAuth) {
  // download the data into a local object
  //$scope.data = $firebaseObject(ref);
  // putting a console.log here won't work, see below
  $scope.authObj = $firebaseAuth();

  $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $window.location.href+="MainPage.html";
    }
    else {

    }
  });

  $scope.Login=function(){
    try{
      $scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
          console.log($scope.authObj.$getAuth())
          $window.location.href=cwd+"/MainPage.html";
        })
        .catch(function(error) {
          console.log(error.message);
          if(error.message==="The email address is badly formatted."){
            swal("Error", "Invalid email", "error");
          }
          else if(error.message==="There is no user record corresponding to this identifier. The user may have been deleted."){
            swal("Error", "There is no user with this email.", "error");
          }
          else if(error.message==="The password is invalid or the user does not have a password."){
            swal("Error", "Wrong password", "error");
          }
          else{
            swal("Error", "Login failes", "error");
          }
        });
    }
    catch(err){
      console.log(err.message)
      if(err.message==="signInWithEmailAndPassword failed: First argument \"email\" must be a valid string."){
        swal("Error", "Please write your email address", "error");
      }
      else if(err.message==="signInWithEmailAndPassword failed: Second argument \"password\" must be a valid string."){
        swal("Error", "Please write your password", "error");
      }
      else{
        swal("Error", "Login failes", "error");
      }
    }
  }
}]);
