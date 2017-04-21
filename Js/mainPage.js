var tabButtons=[];

$( document ).ready(function() {
    tabButtons=$(".tabButton");
    changeTab('Home');
});


function changeTab(tabName){
  $(".tab").removeClass("active");
  $(".tabButton").removeClass("active");
  $("."+tabName).addClass("active");
  $("#navContainer").height(-1);

}

$( document ).ready(function() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip("show");
    });
});

