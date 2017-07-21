//TODO: Create new normalize function that uses exponential movement between values
// use .position() instead of autistic get functions
// move helpers into one object to be imported from separate document
// query type of input device, do something with a touchscreen. scroll based?
//use offsetAngle as input angle value
//normalizeInRange using 0, 5, offsetAngle ratio to determine polar coordinate offset of elements
//convert polar to cartesian using polar offset and absolute distance
// rgb digital text selectors
var red = $( "#red" );
var green = $( "#green" );
var blue = $( "#blue" );
var cyan = $( "#cyan" );
var magenta = $( "#magenta" );
var yellow = $( "#yellow" );

applyRegistrationEffect([red, green, blue], getDigitalTextX, getTextHeightY, 8, 0.99, (1 / 3));
applyRegistrationEffect([cyan, magenta, yellow], getPrintTextX, getTextHeightY, 8, 0.99, (1 / 3));

function getDigitalTextX() {
    var leftContent = $(".left-content");
    var elementWidth = leftContent.width();
    return leftContent.offset().left + elementWidth / 2;
}

function getPrintTextX() {
    var rightContent = $(".right-content");
    var elementWidth = rightContent.width();
    return $(".left-content").width() + elementWidth / 2;
}

function getTextHeightY() {
    return -Number($(".floating-text span").css("margin-top").replace("px", ""));
}
