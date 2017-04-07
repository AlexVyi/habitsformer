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


/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "500px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
