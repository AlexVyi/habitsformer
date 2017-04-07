var app=angular.module('HabitsFormer', ["firebase", "ngRoute"]);

app.controller("ResetPasswordController",["$scope", "$window", "$firebaseObject","$firebaseArray","$firebaseAuth", function($scope,$window, $firebaseObject,$firebaseArray, $firebaseAuth) {
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

  $scope.ResetPassword=function(){
    try{
      $scope.authObj.$sendPasswordResetEmail($scope.email).then(function() {
        swal("Success!", "Password reset email sent successfully!", "success")
      }).catch(function(error) {
        console.log(error.message);
        if(error.message==="There is no user record corresponding to this identifier. The user may have been deleted."){
          swal("Error", "There is no user with this email.", "error");
        }
        else{
          swal("Error", "Email not sent. Please try again", "error");
        }
      });
    }
    catch(err){
      console.log(err.message)
      if(err.message==="sendPasswordResetEmail failed: First argument \"email\" must be a valid string."){
        swal("Error", "Please write your email address", "error");
      }
      else{
        swal("Error", "Email not sent. Please try again", "error");
      }

    }
  }

}]);
