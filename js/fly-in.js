/******************************************************************************
 * FLY-IN.JS - Javascript that will animate any element to fly onto page
 * Author: McKay Smalley - November 2015
 * REQUIRES:
 *         - jQuery
 *         - An element with the id of runway
 * ***************************************************************************/
var flewIn;
var flyDistance;

/******************************************************************************
 * WINDOW LOAD EVENT
 *
 * ***************************************************************************/
$(window).load(function()
{
    //check fly in animation on scroll
    if (!flewIn) checkFlightStatus();
});

/******************************************************************************
 * SCROLL EVENT
 *
 * ***************************************************************************/
$(document).scroll(function()
{
    //check fly in animation on scroll
    if (!flewIn) checkFlightStatus();
});

/******************************************************************************
 * WINDOW RESIZE EVENT
 *
 * ***************************************************************************/
$(window).resize(function()
{
    //check fly in animation on scroll
    if (!flewIn) checkFlightStatus();
});

/******************************************************************************
 * DOCUMENT READY EVENT
 *
 *  - moves fly-in elements off screen to be animated
 * ***************************************************************************/
$(document).ready(function()
{
    if("undefined"==typeof jQuery)
        throw new Error("Fly-in JavaScript requires jQuery");
    else {
        flewIn = false;
        flyDistance = -($('#runway').width());
        var flyerRight = document.getElementsByClassName('fly-in-right');
        var flyerLeft = document.getElementsByClassName('fly-in-left');

        //positions offscreen to the left for flying right
        for (var i = 0; i < flyerRight.length; i++)
        {
            flyerRight[i].style.visibility = 'hidden';
            flyerRight[i].style.position = 'relative';
            flyerRight[i].style.right = flyDistance+'px';
            flyerRight[i].style.opacity = 0;
        }

        //positions offscreen to the right for flying left
        for (i = 0; i < flyerLeft.length; i++)
        {
            flyerLeft[i].style.visibility = 'hidden';
            flyerLeft[i].style.position = 'relative';
            flyerLeft[i].style.left = flyDistance+'px';
            flyerLeft[i].style.opacity = 0;
        }

        //sets the overflow for offscreen elements
        $('#runway').css('overflow', 'hidden');
    }
});

/******************************************************************************
 * CHECK FLIGHT STATUS
 *
 *  - created to avoid needless redundancy amongst different events
 *  - checks to see if fly-in animation has already occured
 * ***************************************************************************/
function checkFlightStatus()
 {
    //gets array for each fly-in elements
    var flyerRight = document.getElementsByClassName('fly-in-right');
    var flyerLeft = document.getElementsByClassName('fly-in-left');

    //flying right animation
    for(var i = 0; i < flyerRight.length; i++)
    {
        if (isVisible(flyerRight[i]) && flyerRight[i].style.visibility == 'hidden')
        {
            flyerRight[i].style.visibility = 'visible';
            flyIn(flyerRight[i], flyDistance);
        }
    }

    //flying left animation
    for(i = 0; i < flyerLeft.length; i++)
    {
        if (isVisible(flyerLeft[i]) && flyerLeft[i].style.visibility == 'hidden')
        {
            flyerLeft[i].style.visibility = 'visible';
            flyIn(flyerLeft[i], -flyDistance);
        }
    }

    //test to see if all the visible elements have flown in
    if (isVisible(bottomFlyer()))
    {
        flewIn = true;

        //set all other fly-in elements to visible and to their correct location
        for(i = 0; i < flyerRight.length; i++)
        {
            if (flyerRight[i].style.visibility != 'visible')
            {
                flyerRight[i].style.visibility = 'visible';
                flyerRight[i].style.right = '0px';
                flyerRight[i].style.opacity = 1;
            }
        }

        //set all other fly-in elements to visible and to their correct location
        for(i = 0; i < flyerLeft.length; i++)
        {
            if (flyerLeft[i].style.visibility != 'visible')
            {
                flyerLeft[i].style.visibility = 'visible';
                flyerLeft[i].style.left = '0px';
                flyerLeft[i].style.opacity = 1;
            }
        }
    }
 }

/******************************************************************************
 * IS VISIBLE
 *
 *  - returns if the element (e) is completely visible or not
 *  - ONLY WORKS VERTICALLY!
 * ***************************************************************************/
 function isVisible(e)
 {
    if (e === null)
    {
        return true;
    }

    var windowTop = $(window).scrollTop();
    var windowBottom = windowTop + $(window).height();
    var eTop = $(e).offset().top;
    var eBottom = eTop + e.offsetHeight;

    if (windowTop < eTop && eTop < windowBottom &&
        windowTop < eBottom && eBottom < windowBottom)
        return true;
    else
        return false;
 }

/******************************************************************************
 * BOTTOM FLYER
 *
 *  - returns the lowest element on the page that is part of either fly-in-left
 *    or fly-in-right classes
 * ***************************************************************************/
function bottomFlyer()
{
    var flyer = Array.prototype.slice.call(document.getElementsByClassName("fly-in-right")).concat(
        Array.prototype.slice.call(document.getElementsByClassName("fly-in-left")));

    var lowest = flyer[0];
    for (var i = 1; i < flyer.length; i++)
    {
        if (flyer[i].offsetHeight > 0 && (($(flyer[i]).offset().top+flyer[i].offsetHeight) > ($(lowest).offset().top+lowest.offsetHeight)))
        {
            lowest = flyer[i];
        }
    }

    if (lowest.offsetHeight <= 0)
        return null;

    else
        return lowest;
}

/******************************************************************************
 * GET OPTIONS
 *
 * - gets the options for the the specified element
 * ***************************************************************************/
function getOptions(e) {
    var elementOptions = {
        "speed": "1",
        "transition-timing-function": "linear"
    };

    if($(e).hasDataAttribute("speed"))
        elementOptions["speed"] = $(e).data("speed");

    if($(e).hasDataAttribute("transition-timing-function"))
        elementOptions["transition-timing-function"] = $(e).data("transition-timing-function");

    return elementOptions;
}

/******************************************************************************
 * HAS DATA ATTRIBUTE
 *
 * - returns true if the element has the attribute set in the form of 
 *   data-"attribute"
 * ***************************************************************************/
$.fn.hasDataAttribute = function(attribute) {
    return $(this).data(attribute) != undefined && $(this).data(attribute) != '';
};

/******************************************************************************
 * FLY IN
 *
 * - animates an element across the x axis
 * ***************************************************************************/
function flyIn(e, flyDistance)
{
    var flight_details = getOptions(e);
    $(e).css('transition',       "all "+flight_details["speed"]+"s "+flight_details["transition-timing-function"]);
    $(e).css('WebkitTransition', "all "+flight_details["speed"]+"s "+flight_details["transition-timing-function"]);
    $(e).css('OTransition',      "all "+flight_details["speed"]+"s "+flight_details["transition-timing-function"]);
    $(e).css('msTransition',     "all "+flight_details["speed"]+"s "+flight_details["transition-timing-function"]);
    $(e).css('MozTransition',    "all "+flight_details["speed"]+"s "+flight_details["transition-timing-function"]);

    $(e).css('transform',       "translateX("+flyDistance+"px)");
    $(e).css('WebkitTransform', "translateX("+flyDistance+"px)");
    $(e).css('OTransform',      "translateX("+flyDistance+"px)");
    $(e).css('msTransform',     "translateX("+flyDistance+"px)");
    $(e).css('MozTransform',    "translateX("+flyDistance+"px)");

    $(e).css('opacity', 1);
}