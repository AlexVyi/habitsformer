var tabButtons=[];

$( document ).ready(function() {
    tabButtons=$(".tabButton");
    changeTab('Home');
});


function changeTab(tabName){
  $(".tab").removeClass("active");
  $(".tabButton").removeClass("active");
  $("."+tabName).addClass("active");
}

