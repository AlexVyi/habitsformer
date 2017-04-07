var app=angular.module('HabitsFormer', ["firebase", "ngRoute"]);


app.controller("MainPageController",["$scope", "$interval", "$window", "$firebaseObject","$firebaseArray","$firebaseAuth", function($scope,  $interval, $window, $firebaseObject,$firebaseArray, $firebaseAuth) {
  // download the data into a local object
  //$scope.data = $firebaseObject(ref);
  // putting a console.log here won't work, see below
  $scope.authObj = $firebaseAuth();
  var ref;
  var firebaseObj;
  var user;

  $scope.GetActualDate=function(){
    return Date.now();
  }


  $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      user=firebaseUser;
      console.log("Signed in as:", firebaseUser.uid);
      ref = firebase.database().ref("users/"+firebaseUser.uid);
      firebaseObj= $firebaseObject(ref)
      firebaseObj.$bindTo($scope, "user").then(function() {
        console.log($scope.user.userName);
        if($scope.user.onHoliday){

        }
        else{
          //creez o cpoie a lui user pe care o folosesc in tab-ul Account
          $scope.editUser={};
          $scope.editUser.uid=firebaseUser.uid;
          $scope.SetEditUser();
          $scope.GetGoals();
        }
      });
    }
    else {
      $window.location.href=cwd;
    }

  });

  //verifica daca ti-ai depasit termenele pt targeturi, apoi salveaza data acutala ca data la care te-ai logat
  $scope.CheckGoalStatus=function(){

  }

  //pt tab-ul Account. acolo imi trebuie o copie a user-ului ca sa nu modific datele sale inainte sa apese save
  $scope.SetEditUser=function(){
    $scope.editUser.userName=$scope.user.userName;
    $scope.editUser.email=$scope.user.email;
    $scope.editUser.level=$scope.user.level;
    $scope.editUser.points=$scope.user.points;
  }

  $scope.GetGoals=function(){
    ref = firebase.database().ref("users/"+user.uid+"/Goals/Donts");
    firebaseObj=$firebaseObject(ref)
    firebaseObj.$bindTo($scope, "donts").then(function() {
      for (var i = 0; i < Object.keys($scope.donts).length-2; i++) {
        $scope.donts["Dont"+i].canUndo=false;
      }
    });
    ref = firebase.database().ref("users/"+user.uid+"/Goals/Dailys");
    firebaseObj=$firebaseObject(ref)
    firebaseObj.$bindTo($scope, "dailys").then(function() {
      for (var i = 0; i < Object.keys($scope.dailys).length-2; i++) {
        $scope.dailys["Daily"+i].canUndo=false;
        $interval($scope.UpdateTime($scope.dailys["Daily"+i]), 1000);
      }
    });
    ref = firebase.database().ref("users/"+user.uid+"/Goals/Weeklys");
    firebaseObj=$firebaseObject(ref)
    firebaseObj.$bindTo($scope, "weeklys").then(function() {
      for (var i = 0; i < Object.keys($scope.weeklys).length-2; i++) {
        $scope.weeklys["Weekly"+i].canUndo=false;
        $interval($scope.UpdateTime($scope.weeklys["Weekly"+i]), 1000);
      }
    });
    ref = firebase.database().ref("users/"+user.uid+"/Goals/Monthlys");
    firebaseObj=$firebaseObject(ref)
    firebaseObj.$bindTo($scope, "monthlys").then(function() {
      for (var i = 0; i < Object.keys($scope.monthlys).length-2; i++) {
        $scope.monthlys["Monthly"+i].canUndo=false;
        $interval($scope.UpdateTime($scope.monthlys["Monthly"+i]), 1000);
      }
    });


  }

  $scope.Logout=function(){
    $scope.authObj.$signOut()
  }

  $scope.AddGoal=function() {
    console.log($scope.newGoal)
    if(!$scope.newGoal.title){
      swal("Error", "Please add a title", "error");
      return
    }
    if(!$scope.newGoal.goalType){
      swal("Error", "Please add a goal type", "error");
      return
    }
    if($scope.newGoal.goalType.toString()=="Dont"){
      if (!$scope.newGoal.points || $scope.newGoal.points>0){
        swal("Error", "Please add points (a negative number smaller than -500)", "error");
        return
      }
    }
    else{
      if (!$scope.newGoal.repeats || $scope.newGoal.repeats<=0){
        swal("Error", "Please add number of repeats (a positive number)", "error");
        return
      }
    }
    $scope.FormatGoal();

    //Nici sa nu intrebi
    switch ($scope.newGoal.goalType.toString()) {
      case "Dont":
        if(!Object.keys($scope.donts).includes("Dont0")){
          $scope.donts["Dont"+(Object.keys($scope.donts).length-3)]=$scope.newGoal;
        }
        else{
          $scope.donts["Dont"+(Object.keys($scope.donts).length-2)]=$scope.newGoal;
        }
      break;
      case "Daily":
        if(!Object.keys($scope.dailys).includes("Daily0")){
          $scope.dailys["Daily"+(Object.keys($scope.dailys).length-3)]=$scope.newGoal;
        }
        else{
          $scope.dailys["Daily"+(Object.keys($scope.dailys).length-2)]=$scope.newGoal;
        }
      break;
      case "Weekly":
        if(!Object.keys($scope.weeklys).includes("Weekly0")){
          $scope.weeklys["Weekly"+(Object.keys($scope.weeklys).length-3)]=$scope.newGoal;
        }
        else{
          $scope.weeklys["Weekly"+(Object.keys($scope.weeklys).length-2)]=$scope.newGoal;
        }
      break;
      case "Monthly":
        if(!Object.keys($scope.monthlys).includes("Monthly0")){
          $scope.monthlys["Monthly"+(Object.keys($scope.monthlys).length-3)]=$scope.newGoal;
        }
        else{
          $scope.monthlys["Monthly"+(Object.keys($scope.monthlys).length-2)]=$scope.newGoal;
        }
      break;
      default:
      }
      $scope.newGoal={};
      changeTab('Home')
    }
    //ok, vad ca ai intrebat
    //fiecare goal e trimis in nodul care ii corespunde tipului sau (de aia switch)
    //fiecare goal primeste un index unic numit tipulSau+un index
    //indexul e obtinut vazand cate goal-uri sunt deja in nodul acelui tip
    //deoarece vreau sa incep indexarea de la 0 si angular adauga de la el doua noduri invizibile in consola scriu -3


    //tot ce fac aici ar fi mult mai eficent cu array-uri in loc de obiecte, dar nu sunt sigur ca functioneaza bindto

    $scope.EditGoal=function(goal){
      console.log("test")
      changeTab("EditGoal")
      $scope.editGoal=goal;
      switch ($scope.editGoal.goalType.toString()) {
        case "Dont":
          var arr = Object.keys($scope.donts).map(function (key) { return $scope.donts[key]; });
          $scope.editGoal.id=$scope.editGoal.goalType.toString()+(arr.indexOf(goal)-2);
        break;
        case "Daily":
          var arr = Object.keys($scope.dailys).map(function (key) { return $scope.dailys[key]; });
          $scope.editGoal.id=$scope.editGoal.goalType.toString()+(arr.indexOf(goal)-2);
        break;
        case "Weekly":
          var arr = Object.keys($scope.weeklys).map(function (key) { return $scope.weeklys[key]; });
          $scope.editGoal.id=$scope.editGoal.goalType.toString()+(arr.indexOf(goal)-2);
        break;
        case "Monthly":
          var arr = Object.keys($scope.monthlys).map(function (key) { return $scope.monthlys[key]; });
          $scope.editGoal.id=$scope.editGoal.goalType.toString()+(arr.indexOf(goal)-2);
        break;
      }
    }

    $scope.SaveChangesGoal=function(editGoal){
      if(!$scope.editGoal.title){
        swal("Error", "Please add a title", "error");
        return
      }
      if(!$scope.editGoal.goalType){
        swal("Error", "Please add a goal type", "error");
        return
      }
      if($scope.editGoal.goalType.toString()=="Dont"){
        if (!$scope.newGoal.points || $scope.newGoal.points>0){
          swal("Error", "Please add points (a negative number smaller than -500)", "error");
          return
        }
      }
      else{
        if (!$scope.editGoal.repeats || $scope.newGoal.repeats<=0){
          swal("Error", "Please add number of repeats (a positive number)", "error");
          return
        }
      }
      try{
        $scope.authObj.$signInWithEmailAndPassword($scope.user.email, $scope.password)
          .then(function(firebaseUser) {
            editGoal.timestamp=Date.now();
            switch ($scope.editGoal.goalType.toString()) {
              case "Dont":
                $scope.donts[editGoal.id]=editGoal;
              break;
              case "Daily":
                $scope.dailys[editGoal.id]=editGoal;
              break;
              case "Weekly":
                $scope.weeklys[editGoal.id]=editGoal;
              break;
              case "Monthly":
                $scope.monthlys[editGoal.id]=editGoal;
              break;
            }
            swal("Success!", "Goal changed successfully!", "success")
            $scope.password=null;
            changeTab("Home")
          })
          .catch(function(error) {
            if(error.message==="The password is invalid or the user does not have a password."){
              swal("Error", "Current password wrong", "error");
            }
            else{
              swal("Error", "Changes not saved", "error");
            }
          });
        }
        catch(err){
          if(err.message==="signInWithEmailAndPassword failed: Second argument \"password\" must be a valid string."){
            swal("Error", "Please write your current password", "error");
          }
        }
    }

    $scope.FormatGoal=function(){
      $scope.newGoal.timestamp=Date.now();
      $scope.newGoal.actualRepeats=0;
      $scope.newGoal.money=0;

      switch ($scope.newGoal.goalType.toString()) {
        case "Dont":
            $scope.newGoal.repeats=1;
        break;
        case "Daily":
            $scope.newGoal.points=500;
            $scope.newGoal.due=Date.now()+1000*3600*24;
        break;
        case "Weekly":
            $scope.newGoal.points=1000;
            $scope.newGoal.due=Date.now()+1000*3600*24*7;
        break;
        case "Monthly":
            $scope.newGoal.points=3000;
            $scope.newGoal.due=Date.now()+1000*3600*24*28;
        break;
        default:
      }
    }

    $scope.CheckGoal=function(goal){
      /*if(goal.goalType.toString()!=="Dont" && goal.actualRepeats>=goal.repeats){
        $scope.user.points+=goal.points/2;
      }
      else{
        $scope.user.points+=goal.points;
      }*/
      if(goal.goalType.toString()!=="Dont"){
        goal.actualRepeats++;
      }
      else{
        $scope.previosePoints=$scope.user.points;
        $scope.user.points+=goal.points;
      }

      /*if($scope.user.points>$scope.GetFibbonacci($scope.user.level)*1000){
        $scope.user.level++;
      }*/
      if($scope.user.level>1 && $scope.user.points<$scope.GetFibbonacci($scope.user.level-1)*1000){
        $scope.user.level--;
      }
      if($scope.user.points<0){
        $scope.user.points=0;
      }
      goal.canUndo=true;
      $scope.SetEditUser();
    }

    $scope.UndoGoal=function(goal){
      /*if(goal.goalType.toString()!=="Dont" && goal.actualRepeats>goal.repeats){
        $scope.user.points-=goal.points/2;
      }
      else{
        $scope.user.points-=goal.points;
      }*/
      if(goal.goalType.toString()!=="Dont"){
        goal.actualRepeats--;
      }
      else{
        //daca ai 0 puncte si apesi pe dont apoi undo primesti punte de si nu ar trebui. variabila $scope.previosePoints rezolva problema asta
        $scope.user.points=$scope.previosePoints;
      }

      if($scope.user.points>$scope.GetFibbonacci($scope.user.level)*1000){
        $scope.user.level++;
      }
      goal.canUndo=false;
      $scope.SetEditUser();
    }


    $scope.SaveAccountChanges=function(){
      if($scope.newPsw && !$scope.newPsw.length<=8){
        swal("Error", "New password needs to be over 8 characters long", "error");
        return;
      }
      try{
        $scope.authObj.$signInWithEmailAndPassword($scope.user.email, $scope.editUser.acutalPsw)
          .then(function(firebaseUser) {
            if ($scope.user.userName!=$scope.editUser.userName){
              swal("Success!", "Name changed successfully!", "success")
            }
            $scope.user.userName=$scope.editUser.userName;
            if ($scope.editUser.newPsw){
              if($scope.editUser.newPsw ===$scope.editUser.confNewPsw){
                $scope.authObj.$updatePassword($scope.editUser.newPsw).then(function() {
                  swal("Success!", "Password changed successfully!", "success")
                }).catch(function(error) {
                  swal("Error", "Password change failed", "error");
                });
              }
              else{
                swal("Error", "New passwords do not match", "error");
              }
            }

            if($scope.editUser.email !== $scope.user.email){
              $scope.authObj.$updateEmail($scope.editUser.email).then(function() {
                $scope.user.email=$scope.editUser.email;
                swal("Success!", "Email changed successfully!", "success")
              }).catch(function(error) {
                swal("Error", "Email change failed", "error");
              });
            }
            $scope.authObj.$signInWithEmailAndPassword($scope.user.email, $scope.editUser.acutalPsw);
            $scope.editUser.acutalPsw=null;
          })
          .catch(function(error) {
            if(error.message==="The password is invalid or the user does not have a password."){
              swal("Error", "Current password wrong", "error");
            }
            else{
              swal("Error", "Changes not saved", "error");
            }
          });
        }
        catch(err){
          if(err.message==="signInWithEmailAndPassword failed: First argument \"email\" must be a valid string."){
            swal("Error", "Please write your email address", "error");
          }
          if(err.message==="signInWithEmailAndPassword failed: Second argument \"password\" must be a valid string."){
            swal("Error", "Please write your current password", "error");
          }
        }
    }

    $scope.EnterHolidayMode=function(){
      try{
        $scope.authObj.$signInWithEmailAndPassword($scope.user.email, $scope.editUser.acutalPsw)
          .then(function(firebaseUser) {
            swal({
              title: "Are you sure you wish to enter holiday mode?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes!",
              cancelButtonText: "No, cancel!",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm){
              if (isConfirm) {
                swal("Have fun during holiday!", "Holiday mode entered succesfully. We hope to see you again soon", "success")
                $scope.user.onHoliday=true;
              } else {
                swal("Cancelled", "", "error");
              }
            });
          })
          .catch(function(error) {
            if(error.message==="The password is invalid or the user does not have a password."){
              swal("Error", "Current password wrong", "error");
            }
            else{
              swal("Error", "Error while trying to enter holiday mode", "error");
            }
          });
        }
        catch(err){
          if(err.message==="signInWithEmailAndPassword failed: Second argument \"password\" must be a valid string."){
            swal("Error", "Please write your current password", "error");
          }
        }
    }

    $scope.EndHolidayMode=function(){
      try{
        $scope.authObj.$signInWithEmailAndPassword($scope.user.email, $scope.password)
          .then(function(firebaseUser) {
            $scope.user.onHoliday=false;
            var arr = Object.keys($scope.dailys).map(function (key) { return $scope.dailys[key]; });
            for (var i = 0; i < arr.length-2; i++) {
              $scope.dailys["Daily"+i].due=Date.now()+1000*3600*24;
              $scope.dailys["Daily"+i].actualRepeats=0;
            }
            var arr = Object.keys($scope.weeklys).map(function (key) { return $scope.weeklys[key]; });
            for (var i = 0; i < arr.length-2; i++) {
              $scope.weeklys["Weekly"+i].due=Date.now()+1000*3600*24*7;
                $scope.weeklys["Weekly"+i].actualRepeats=0;
            }
            var arr = Object.keys($scope.monthlys).map(function (key) { return $scope.monthlys[key]; });
            for (var i = 0; i < arr.length-2; i++) {
              $scope.monthlys["Monthly"+i].due=Date.now()+1000*3600*24*28;
              $scope.monthlys["Monthly"+i].actualRepeats=0;
            }
          })
          .catch(function(error) {
            if(error.message==="The password is invalid or the user does not have a password."){
              swal("Error", "Current password wrong", "error");
            }
            else{
              swal("Error", "Error while trying to enter holiday mode", "error");
            }
          });
        }
        catch(err){

          if(err.message==="signInWithEmailAndPassword failed: Second argument \"password\" must be a valid string."){
            swal("Error", "Please write your current password", "error");
          }
        }
    }

    $scope.DeleteAccount=function(){
      try{
        $scope.authObj.$signInWithEmailAndPassword($scope.user.email, $scope.editUser.acutalPsw)
          .then(function(firebaseUser) {
            swal({
              title: "Are you sure you ant to delete your account?",
              text: "You will not be able to restore it!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              cancelButtonText: "No, cancel!",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm){
              if (isConfirm) {
                ref = firebase.database().ref("users/"+firebaseUser.uid)
                var obj = $firebaseObject(ref);
                obj.$remove().then(function(ref) {
                  // data has been deleted locally and in the database
                }, function(error) {
                  console.log("Error:", error);
                });
                $scope.authObj.$deleteUser().then(function() {
                  swal("We hope to see you again!", "Your account has been deleted.", "success")
                }).catch(function(error) {
                  console.error("Error: ", error);
                });
              }
              else {
                swal("Cancelled", "We're glad you're still with us", "error");
              }
            });
          })
          .catch(function(error) {
            if(error.message==="The password is invalid or the user does not have a password."){
              swal("Error", "Wrong password", "error");
            }
            else{
              swal("Error", "Delete account failed", "error");
            }
          });
      }
      catch(err){
        if(err.message==="signInWithEmailAndPassword failed: Second argument \"password\" must be a valid string."){
          swal("Error", "Please write your current password", "error");
        }
      }
    }

    $scope.GetFibbonacci=function(n){
       var f1=2
       var f2=3
       var f=5;
       for(var i=0; i<n-1; i++){
         f1=f2;
         f2=f;
         f=f1+f2;
       }
       return f;
    }


    $scope.UpdateTime=function (goal){
      var t=goal.due-Date.now();
      if(t<0){
        var dosBalance=goal.actualRepeats-goal.repeats;
        if(dosBalance>=0){
          console.log($scope.user.points)
          $scope.user.points+=goal.repeats*goal.points;
          console.log($scope.user.points)
          $scope.user.points+=dosBalance*goal.points/2;
          console.log($scope.user.points)
        }
        else{
          $scope.user.points+=dosBalance*goal.points;
        }

        switch (goal.goalType.toString()) {
          case "Daily":
            goal.due+=1000*3600*24
          break;
          case "Weekly":
            goal.due+=1000*3600*24*7
          break;
          case "Monthly":
            goal.due+=1000*3600*24*28
          break;
          default:

        }
        goal.actualRepeats=0;
        if($scope.user.points>$scope.GetFibbonacci($scope.user.level)*1000){
          $scope.user.level++;
        }
        else if($scope.user.level>1 && $scope.user.points<$scope.GetFibbonacci($scope.user.level-1)*1000){
          $scope.user.level--;
        }
        if($scope.user.points<0){
          $scope.user.points=0;
        }
        $scope.SetEditUser();
      }
      else{

        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var daysTillWeek =Math.floor( t/(1000*60*60*24)%7 );
        var daysTillMonth = Math.floor( t/(1000*60*60*24)%28 );
        return {
          'total': t,
          'daysTillMonth': daysTillMonth,
          'daysTillWeek': daysTillWeek,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
        };
      }
    }




}]);

app.filter('numberFixedLen', function () {
    return function(a,b){
        return(1e4+""+a).slice(-b);
    };
});
