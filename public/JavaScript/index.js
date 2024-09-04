
$(".signUp").css("display","none");
$(".login").addClass("down");


$(".login").click(function() {
    $(".adminLogin").css("display","flex");
    $(".signUp").css("display","none");
    $(".signup").removeClass("down");
    $(".signup").addClass("up");
    $(this).addClass("down");
});

$(".signup").click(function(){
    $(".signUp").css("display","flex");
    $(".adminLogin").css("display","none");
    $(".login").removeClass("down");
    $(".login").addClass("up");
    $(this).addClass("down");
});


$(".warning button").click(function(){
    $(".warning").css("display","none");
});