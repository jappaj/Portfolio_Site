//TODO: 
var red = $( "#red" );
var green = $( "#green" );
var blue = $( "#blue" );
var cyan = $( "#cyan" );
var magenta = $( "#magenta" );
var yellow = $( "#yellow" );

applyRegistrationEffect([red, green, blue], getDigitalTextX, getTextHeightY, 8, 0.99, (1 / 3), false);
applyRegistrationEffect([cyan, magenta, yellow], getPrintTextX, getTextHeightY, 8, 0.99, (1 / 3), false);

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
