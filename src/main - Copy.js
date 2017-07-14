"use strict";

//TODO: Create new normalize function that uses exponential movement between values
//
//use offsetAngle as input angle value
//normalizeInRange using 0, 5, offsetAngle ratio to determine polar coordinate offset of elements
//convert polar to cartesian using polar offset and absolute distance
$(function() {
    var maxXPercentDiff = 8;
    var maxYPercentDiff = 0.99;
    var maxDistance = $( window ).height() / 3;
    // rgb digital text selectors
    var red = $( "#red" );
    var green = $( "#green" );
    var blue = $( "#blue" );
    

    red.css("transform", "translate(-" + (50 + maxXPercentDiff) + "%)");
    green.css("transform", "translate(-" + (50 - maxXPercentDiff) + "%, " + (-maxYPercentDiff) + "%)");
    blue.css("transform", "translate(-" + (50 - maxXPercentDiff) + "%, " + (maxYPercentDiff) + "%)");

    function applyColorEffect(elements, colors, maxDistanceRatio) {
        var digitalX = getDigitalTextX();
        var digitalY = getTextHeightY();
        
        $( window ).resize(function() {
            digitalY = getTextHeightY();
            digitalX = getDigitalTextX();
            maxDistance = $( window ).height() / 3;
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

            var redMediaPercent = normalizeInRange(50.3, 50 + maxXPercentDiff, ratio);
            red.css("transform", "translate(-" + redMediaPercent + "%)");

            var greenMediaXPercent = normalizeInRange(50, 50 - maxXPercentDiff, ratio);
            var greenMediaYPercent = normalizeInRange(0, 0 - maxYPercentDiff, ratio);
            green.css("transform", "translate(-" + greenMediaXPercent + "%, " + greenMediaYPercent + "%)");

            var blueMediaXPercent = normalizeInRange(49.7, 50 - maxXPercentDiff, ratio);
            var blueMediaYPercent = normalizeInRange(0, 0 + maxYPercentDiff, ratio);
            blue.css("transform", "translate(-" + blueMediaXPercent + "%, " + blueMediaYPercent + "%)");

            var minOpacity = 1 - (ratio / 2);

            var redThetaRatio = redThetaBase(offsetAngle);
            var redAlpha = normalizeInRange(1, minOpacity, redThetaRatio);
            red.css("opacity", redAlpha);

            var greenThetaRatio = greenThetaBase(offsetAngle);
            var greenAlpha = normalizeInRange(1, minOpacity, greenThetaRatio);
            green.css("opacity", greenAlpha);

            var blueThetaRatio = blueThetaBase(offsetAngle);
            var blueAlpha = normalizeInRange(1, minOpacity, blueThetaRatio);
            blue.css("opacity", blueAlpha);
        });
    }
    
    function getDigitalTextX() {
        var leftContent = $(".left-content");
        var elementWidth = leftContent.width();
        return leftContent.offset().left + elementWidth / 2;
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
    
    function redThetaBase(theta) {
        if (0 < theta && theta < Math.PI) {
            return theta / Math.PI;
        } else {
            return 2 - (theta / Math.PI);
        }
    }
    
    function greenThetaBase(theta) {
        if (((4 * Math.PI) / 3) < theta && theta < (2 * Math.PI)){
            return (theta - ((4 * Math.PI) / 3)) / Math.PI;
        } else if (0 < theta && theta < (Math.PI / 3)) {
            return ((theta + ((2 * Math.PI) / 3)) / Math.PI);
        } else if (((Math.PI / 3) < theta) && (theta < ((4 * Math.PI) / 3))) {
            return (1 - ((theta - (Math.PI / 3)) / Math.PI) );
        }
    }
    
    function blueThetaBase(theta) {
        if (((2 * Math.PI) / 3) < theta && theta < ((5 * Math.PI) / 3)) {
            return (theta - ((2 * Math.PI) / 3)) / Math.PI;
        } else if (((5 * Math.PI) / 3) < theta && theta < (2 * Math.PI)) {
            return 1 + ((((5 * Math.PI) / 3) - theta) / Math.PI);
        } else if (0 < theta && theta < ((2 * Math.PI) / 3)) {
            return ((((2 * Math.PI) / 3) - theta) / Math.PI);
        }
    }
                   
    
                   
    
    
});