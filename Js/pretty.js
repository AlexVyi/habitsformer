
/*********toggle pages*************/
$(document).ready(function () {

    $("#continue").click(function () {
        $(".panel-info").removeClass("hidden");
        $(".form-group").removeClass("hidden");
        $("#theRealContinue").removeClass("hidden");
        $("#theFakeBack").removeClass("hidden");
        $("#check").removeClass("hidden");
        // $("#overlay").addClass("hidden");
        $("#mainContainer").addClass("hidden");

    });
/******delay the loading of button from landing*****/

    setTimeout(function(){
        $("#delayDueToFb").fadeIn(500);
    }, 1500);

    $("#theFakeBack").click(function () {
        $(".panel-info").addClass("hidden");
        $(".form-group").addClass("hidden");
        $("#theRealContinue").addClass("hidden");
        $("#check").addClass("hidden");
        $("#mainContainer").removeClass("hidden");
    });

});






/*var times = 0;
var container = document.getElementById("loginContainer");
var mainContainer = document.getElementById("mainContainer");
function urlChange() {
    "use strict";
    times++;
    location.hash = times;
}
urlChange();
    window.onhashchange = function() {
        "use strict";

        if (location.hash.length > mainContainer[0]) {
            times = parseInt(location.hash.replace('#',''),10);
        } else {
            times = 0;
        }
     mainContainer.innerHTML = mainContainer + times;

}*/
