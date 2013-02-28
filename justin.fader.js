/*
 justin.fader.js

 Author: Justin Raynard

 A class to fade between slides with multiple options using jquery animation and queue
 */

var justinFader = {
    animationSettings: {
        animationSpeed: 1000,
        delayAtStart: false,
        delayTime: 1000,
        hiddenObjects: [],
        loop: true,
        slides: null,
        shownObjects: [],
        startSlide: 0
    },
    fade: function (options) {

        options = options || {};
        var s = $.extend({}, justinFader.animationSettings, options)
        var animationQueue = $({});

        if (!s.slides) {
            console.log("Slide object cannot be null.");
            return;
        }

        if (s.slides.length === 0) {
            console.log("Slide object was empty.");
            return;
        }

        //set up the initial state of the animation and start it over
        var reset = function () {
            if (s.hiddenObjects) {
                for (var i = 0; i < s.hiddenObjects.length; i++) {
                    $(s.hiddenObjects[i]).css('opacity', 0);
                    $(s.hiddenObjects[i]).hide();
                }
            }

            if (s.shownObjects) {
                for (var i = 0; i < s.shownObjects.length; i++) {
                    $(s.shownObjects[i]).css('opacity', 1);
                    $(s.shownObjects[i]).show();
                }
            }

            run();
        };

        var addDelayToQueue = function () {
            animationQueue.delay(s.delayTime);
        };

        var addToQueue = function (index, opacity) {
            //first show the object, in case it is a div with links
            if (opacity === 1) {
                animationQueue.queue(function (next) { $(s.slides[index]).show(); next(); });
            }

            animationQueue.queue(function (next) { animateOpacity(index, opacity, next) });

            //hide if no longer visible so link is not present
            if (opacity === 0) {
                animationQueue.queue(function (next) { $(s.slides[index]).hide(); next(); });
            }
        };

        var animateOpacity = function (index, opacityValue, next) {
            $(s.slides[index]).animate({
                opacity: opacityValue
            }, s.animationSpeed, next);
        };

        //loop through the slides with a set delay between each fade
        var run = function () {
            if (s.delayAtStart) {
                addDelayToQueue();
            }
            for (var i = s.startSlide; i < s.slides.length; i++) {
                addToQueue(i, 1);
                addDelayToQueue();
            }
            //reset every slide except first and last to initial state
            animationQueue.queue(function (next) {
                for (var i = 1; i < s.slides.length - 1; i++) {
                    $(s.slides[i]).css('opacity', 0);
                }
                next();
            });
            //fade the last slide out so we go back to inital state
            addToQueue(s.slides.length - 1, 0);
            //start over if looping is active
            if (s.loop) {
                animationQueue.queue(function (next) {
                    reset();
                    next();
                });
            }
        };

        run();
    }
};