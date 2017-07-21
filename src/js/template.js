//TODO: modify registration effect doc to invert direction of registration mark effect
// REMEMBER: remove jQuery wrapper when finished with development

$(function() {
    var regRed = $( "#registration-red" );
    var regGreen = $( "#registration-green" );
    var regBlue = $( "#registration-blue" );
    var regNwCyan = $( "#registration-nw-cyan" );
    var regNwMagenta = $( "#registration-nw-magenta" );
    var regNwYellow = $( "#registration-nw-yellow" );
    var regSeCyan = $( "#registration-se-cyan" );
    var regSeMagenta = $( "#registration-se-magenta" );
    var regSeYellow = $( "#registration-se-yellow" );
    var nwReg = $( ".nw-registration" );
    var seReg = $( ".se-registration" );
    
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
    
    applyRegistrationEffect([regNwCyan, regNwMagenta, regNwYellow], function(nwReg) {
        var nwRegPosX = nwReg.offset().left;
        var nwRegWidth = nwReg.width();

        return nwRegPosX + (nwRegWidth / 2);
    }.bind(this, nwReg), function(nwReg) {
        var nwRegPosY = nwReg.offset().top;
        var nwRegHeight = nwReg.height();

        return nwRegPosY + (nwRegHeight / 2);
    }.bind(this, nwReg), 12, 12, (1 / 2));

    applyRegistrationEffect([regSeCyan, regSeMagenta, regSeYellow], function(seReg) {
        var seRegPosX = seReg.offset().left;
        var seRegWidth = seReg.width();

        return seRegPosX + (seRegWidth / 2);
    }.bind(this, seReg), function(seReg) {
        var seRegPosY = seReg.offset().top;
        var seRegHeight = seReg.height();

        return seRegPosY + (seRegHeight / 2);
    }.bind(this, seReg), 12, 12, (1 / 2));   
});