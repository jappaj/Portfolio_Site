//TODO: 
// mustache -p footer.mustache -p header.mustache .\templateData.json .\template.mustache | Out-File -en utf8 ../../HFtest.html
// REMEMBER: remove jQuery wrapper when finished with development


//fade function, @fcalderan on stackoverflow
var divs = $('.header-fade-text'),
limit = 20; /* scrolltop value when opacity should be 0 */

$(window).on('scroll', function() {
   var st = $(this).scrollTop();

   /* avoid unnecessary call to jQuery function */
   if (st <= limit) {
      divs.css({ 'opacity' : (1 - st/limit) });
   }
});
    //end fade function

$('.image-container')/*.not('.multi-container')*/.slick({
    fade: true,
    centerMode: true,
    adaptiveHeight: true,
    arrows: true,
    dots: true,
    focusOnSelect: true,
    swipeToSlide: true,
    zIndex: 1

});

/*$('.multi-container').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,

    fade: true,
    arrows: true,
    dots: true,
    focusOnSelect: true,
    swipeToSlide: true,
    zIndex: 1
});*/

$( ".nw-registration, .se-registration").each(function() {
    $(this).each(function() {
        applyRegistrationEffect(
            $(this).children("img"), function() {
                var nwRegPosX = $(this).offset().left;
                var nwRegWidth = $(this).width();

                return nwRegPosX + (nwRegWidth / 2);
            }.bind(this), function() {
                var nwRegPosY = $(this).offset().top;
                var nwRegHeight = $(this).height();

                return nwRegPosY + (nwRegHeight / 2);
            }.bind(this), 12, 12, (1 / 4), true
        );
    });
}); 
