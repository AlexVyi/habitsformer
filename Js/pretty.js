
/*********toggle pages*************/
$(document).ready(function () {

    $("#continue").click(function () {
        $(".panel-info").removeClass("hidden");
        $(".form-group").removeClass("hidden");
        $("#theRealContinue").removeClass("hidden");
        $("#check").removeClass("hidden");
        // $("#overlay").addClass("hidden");
        $("#mainContainer").addClass("hidden");

    });
/******delay the loading of button from landing*****/

    setTimeout(function(){
        $("#delayDueToFb").fadeIn(500);
    }, 1500);

});
/**set the input for eneter holiday either with fb or with native login.*/
 /*also tell the user that next time, to login with the new pass if success.*/

