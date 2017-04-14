
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

window.addEventListener(onclick, function backPage() {
    var page = document.getElementById("loginContainer");
    if (page) {
        window.history.go(-1);
    }
});
