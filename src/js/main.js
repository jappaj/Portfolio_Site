"use strict";

//TODO: Create new normalize function that uses exponential movement between values
// use .position() instead of autistic get functions
// move helpers into one object to be imported from separate document
// query type of input device, do something with a touchscreen. scroll based?
//use offsetAngle as input angle value
//normalizeInRange using 0, 5, offsetAngle ratio to determine polar coordinate offset of elements
//convert polar to cartesian using polar offset and absolute distance
$(function() {
    // rgb digital text selectors
    var red = $( "#red" );
    var green = $( "#green" );
    var blue = $( "#blue" );
    var cyan = $( "#cyan" );
    var magenta = $( "#magenta" );
    var yellow = $( "#yellow" );
    
    applyRegistrationEffect([red, green, blue], getDigitalTextX, getTextHeightY, 8, 0.99, (1 / 3));
    applyRegistrationEffect([cyan, magenta, yellow], getPrintTextX, getTextHeightY, 8, 0.99, (1 / 3));
    var RegistrationEffect = {
        
    };
    /**
     * Applies registration effect to an array of three DOM elements.
     * Spreads and aligns elements based on mouse distance from a central point; changes opacity based on relative angle of mouse to elements. The elements move west, northeast, and southeast, respectively.
     * This function also sets each object's initial positions, therefore the elements must be stacked on top of one another.
     * @param {array} elements An array of three jQuery selectors.
     * @param {function} centerX A function that returns the x coordinate in pixels of the center of the effect.
     * @param {function} centerY A function that returns the y coordinate in pixels of the center of the effect.
     * @param {number} maxXPercentDiff Defines the maximum percent difference of x axis movement.
     * @param {number} maxYPercentDiff Defines the maximum percent difference of y axis movement.
     * @param {number} maxDistanceRatio Ratio of window height as max distance to activate effect. e.g: 1/3.
     */
    function applyRegistrationEffect(elements, centerX, centerY, maxXPercentDiff, maxYPercentDiff, maxDistanceRatio) {
        if (elements.length != 3) {
            throw "Must use exactly three (3) elements";
        }
        
        var digitalX = centerX();
        var digitalY = centerY();
        
        var w = elements[0];
        var ne = elements[1];
        var se = elements[2];
        
        w.css("transform", "translate(-" + (50 + maxXPercentDiff) + "%)");
        ne.css("transform", "translate(-" + (50 - maxXPercentDiff) + "%, " + (-maxYPercentDiff) + "%)");
        se.css("transform", "translate(-" + (50 - maxXPercentDiff) + "%, " + (maxYPercentDiff) + "%)");
        
        var maxDistance = $( window ).height() * maxDistanceRatio;
        
        $( window ).resize(function() {
            digitalX = centerX();
            digitalY = centerY();
            maxDistance = $( window ).height() * maxDistanceRatio;
        });

        $( document ).on("mousemove", function( event ) {
            // x y mouse coordinates
            var x = event.pageX;
            var y = event.pageY;

            var distance = getDistance(x, y, digitalX, digitalY);
            var ratio = distance > maxDistance ? 1.0 : distance / maxDistance;

            var normalizedX = x - digitalX;
            var normalizedY = -y + digitalY;
            var offsetAngle = angleFromPoint(normalizedX, normalizedY);
            // console.log(offsetAngle);

            var wMediaPercent = normalizeInRange(50.3, 50 + maxXPercentDiff, ratio);
            w.css("transform", "translate(-" + wMediaPercent + "%)");

            var neMediaXPercent = normalizeInRange(50, 50 - maxXPercentDiff, ratio);
            var neMediaYPercent = normalizeInRange(0, 0 - maxYPercentDiff, ratio);
            ne.css("transform", "translate(-" + neMediaXPercent + "%, " + neMediaYPercent + "%)");

            var seMediaXPercent = normalizeInRange(49.7, 50 - maxXPercentDiff, ratio);
            var seMediaYPercent = normalizeInRange(0, 0 + maxYPercentDiff, ratio);
            se.css("transform", "translate(-" + seMediaXPercent + "%, " + seMediaYPercent + "%)");

            var minOpacity = 1 - (ratio / 2);

            var wThetaRatio = wThetaBase(offsetAngle);
            var wAlpha = normalizeInRange(1, minOpacity, wThetaRatio);
            w.css("opacity", wAlpha);

            var neThetaRatio = neThetaBase(offsetAngle);
            var neAlpha = normalizeInRange(1, minOpacity, neThetaRatio);
            ne.css("opacity", neAlpha);

            var seThetaRatio = seThetaBase(offsetAngle);
            var seAlpha = normalizeInRange(1, minOpacity, seThetaRatio);
            se.css("opacity", seAlpha);
        });
    }
    
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
    
    function getDistance(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;

        return Math.sqrt( a*a + b*b );
    }
    
    // normalizes a value between 0.0 and 1.0 inclusive to a proportion of start / end
    function normalizeInRange(start, end, value) {
        if (value < 0.0 || value > 1.0) {
            return -1;
        }

        if (end < start) {
            // if end is 45 and start is 50
            
            return start - ((start - end) * value);        
        } else {
            // if end is 55 and start is 50
            
            return start + ((end - start) * value);
        }
    }
    
    function angleFromPoint(x, y) {
        if (x == 0 && y == 0) {
            // origin
            return 0;
        } else if (x == 0) {
            // vertical
            return y > 0 ? Math.PI/2 : ((4 * Math.PI) / 3);
        } else if (y == 0) {
            // horizontal
            return x > 0 ? 0 : Math.PI;
        } else if ((x < 0 && y > 0) || (x < 0 && y < 0)) {
            // quadrant 2 or quadrant 3
            return Math.PI + Math.atan(y / x);
        } else if (x > 0 && y < 0) {
            // quadrant 4
            return (2 * Math.PI) + Math.atan(y / x);
        }
        
        // quadrant 1
        return Math.atan(y / x);
    }
    
    function polarToCartesian(r, theta) {        
        return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
    }
    
    function radialDistance(start, end, theta) {
        var endTemp = end;
        var startTemp = start;
        
        if (end < start) {
            endTemp = (2 * Math.PI) + end;
        }
        
        if (start < theta && theta < temp) {
            return (theta - start) / Math.PI;
        }
    }
    
    function wThetaBase(theta) {
        if (0 < theta && theta < Math.PI) {
            return theta / Math.PI;
        } else {
            return 2 - (theta / Math.PI);
        }
    }
    
    function neThetaBase(theta) {
        if (((4 * Math.PI) / 3) < theta && theta < (2 * Math.PI)){
            return (theta - ((4 * Math.PI) / 3)) / Math.PI;
        } else if (0 < theta && theta < (Math.PI / 3)) {
            return ((theta + ((2 * Math.PI) / 3)) / Math.PI);
        } else if (((Math.PI / 3) < theta) && (theta < ((4 * Math.PI) / 3))) {
            return (1 - ((theta - (Math.PI / 3)) / Math.PI) );
        }
    }
    
    function seThetaBase(theta) {
        if (((2 * Math.PI) / 3) < theta && theta < ((5 * Math.PI) / 3)) {
            return (theta - ((2 * Math.PI) / 3)) / Math.PI;
        } else if (((5 * Math.PI) / 3) < theta && theta < (2 * Math.PI)) {
            return 1 + ((((5 * Math.PI) / 3) - theta) / Math.PI);
        } else if (0 < theta && theta < ((2 * Math.PI) / 3)) {
            return ((((2 * Math.PI) / 3) - theta) / Math.PI);
        }
    }
                   
    
                   
    
    
});