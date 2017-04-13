

$(document).ready(function () {

    $("#continue").click(function () {
        $(".panel-info").removeClass("hidden");
        $(".form-group").removeClass("hidden");
        $("#theRealContinue").removeClass("hidden");
        $("#check").removeClass("hidden");
        // $("#overlay").addClass("hidden");
        $("#mainContainer").addClass("hidden");

    });


    setTimeout(function(){
        $("#delayDueToFb").fadeIn(500);
    }, 1500);

});