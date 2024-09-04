var cards = $(".cards"); // jQuery object containing all .cards elements
var hashSet = [];
var postsData = "";

// Clear existing content in .posts
$(".posts").empty();

for (let i = 0; i < cards.length; i++) {
    let randNum;

    do {
        randNum = Math.floor(Math.random() * cards.length);
    } while (hashSet.includes(randNum));

    hashSet.push(randNum);
    postsData += cards.eq(randNum).prop('outerHTML'); // Use .eq() to get the element at randNum and .prop('outerHTML') to get its HTML
}

// Add the collected HTML to .posts
$(".posts").html(postsData); // Use .html() to insert HTML content
