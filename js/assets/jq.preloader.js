/** @preserve jQuery animateNumber plugin v0.0.10
 * (c) 2013, Alexandr Borisov.
 * https://github.com/aishek/jquery-animateNumber
 */

// ['...'] notation using to avoid names minification by Google Closure Compiler
(function($) {
    var reverse = function(value) {
        return value.split('').reverse().join('');
    };

    var defaults = {
        numberStep: function(now, tween) {
            var floored_number = Math.floor(now),
                target = $(tween.elem);

            target.text(floored_number);
        }
    };

    var handle = function( tween ) {
        var elem = tween.elem;
        if ( elem.nodeType && elem.parentNode ) {
            var handler = elem._animateNumberSetter;
            if (!handler) {
                handler = defaults.numberStep;
            }
            handler(tween.now, tween);
        }
    };

    if (!$.Tween || !$.Tween.propHooks) {
        $.fx.step.number = handle;
    } else {
        $.Tween.propHooks.number = {
            set: handle
        };
    }

    var extract_number_parts = function(separated_number, group_length) {
        var numbers = separated_number.split('').reverse(),
            number_parts = [],
            current_number_part,
            current_index,
            q;

        for(var i = 0, l = Math.ceil(separated_number.length / group_length); i < l; i++) {
            current_number_part = '';
            for(q = 0; q < group_length; q++) {
                current_index = i * group_length + q;
                if (current_index === separated_number.length) {
                    break;
                }

                current_number_part = current_number_part + numbers[current_index];
            }
            number_parts.push(current_number_part);
        }

        return number_parts;
    };

    var remove_precending_zeros = function(number_parts) {
        var last_index = number_parts.length - 1,
            last = reverse(number_parts[last_index]);

        number_parts[last_index] = reverse(parseInt(last, 10).toString());
        return number_parts;
    };

    $.animateNumber = {
        numberStepFactories: {
            /**
             * Creates numberStep handler, which appends string to floored animated number on each step.
             *
             * @example
             * // will animate to 100 with "1 %", "2 %", "3 %", ...
             * $('#someid').animateNumber({
       *   number: 100,
       *   numberStep: $.animateNumber.numberStepFactories.append(' %')
       * });
             *
             * @params {String} suffix string to append to animated number
             * @returns {Function} numberStep-compatible function for use in animateNumber's parameters
             */
            append: function(suffix) {
                return function(now, tween) {
                    var floored_number = Math.floor(now),
                        target = $(tween.elem);

                    target.prop('number', now).text(floored_number + suffix);
                };
            },

            /**
             * Creates numberStep handler, which format floored numbers by separating them to groups.
             *
             * @example
             * // will animate with 1 ... 217,980 ... 95,217,980 ... 7,095,217,980
             * $('#world-population').animateNumber({
       *    number: 7095217980,
       *    numberStep: $.animateNumber.numberStepFactories.separator(',')
       * });
             *
             * @params {String} [separator=' '] string to separate number groups
             * @params {String} [group_length=3] number group length
             * @returns {Function} numberStep-compatible function for use in animateNumber's parameters
             */
            separator: function(separator, group_length) {
                separator = separator || ' ';
                group_length = group_length || 3;

                return function(now, tween) {
                    var floored_number = Math.floor(now),
                        separated_number = floored_number.toString(),
                        target = $(tween.elem);

                    if (separated_number.length > group_length) {
                        var number_parts = extract_number_parts(separated_number, group_length);

                        separated_number = remove_precending_zeros(number_parts).join(separator);
                        separated_number = reverse(separated_number);
                    }

                    target.prop('number', now).text(separated_number);
                };
            }
        }
    };

    $.fn.animateNumber = function() {
        var options = arguments[0],
            settings = $.extend({}, defaults, options),

            target = $(this),
            args = [settings];

        for(var i = 1, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }

        // needs of custom step function usage
        if (options.numberStep) {
            // assigns custom step functions
            var items = this.each(function(){
                this._animateNumberSetter = options.numberStep;
            });

            // cleanup of custom step functions after animation
            var generic_complete = settings.complete;
            settings.complete = function() {
                items.each(function(){
                    delete this._animateNumberSetter;
                });

                if ( generic_complete ) {
                    generic_complete.apply(this, arguments);
                }
            };
        }

        return target.animate.apply(target, args);
    };

}(jQuery));


/*
 * jPreLoader - jQuery plugin
 * Create a Loading Screen to preload images and content for you website
 *
 * Name:			jPreLoader.js
 * Author:		Kenny Ooi - http://www.inwebson.com
 * Date:			July 11, 2012
 * Version:		2.1
 * Example:		http://www.inwebson.com/demo/jpreloader-v2/
 *
 */

(function($) {
    var items = [],
        errors = [],
        onComplete = function() {},
        current = 0,
        startTime = 0;

    var jpreOptions = {
        splashVPos: '35%',
        loaderVPos: '75%',
        splashID: '#jpreContent',
        showSplash: true,
        showPercentage: true,
        autoClose: true,
        closeBtnText: 'Start!',
        onetimeLoad: false,
        debugMode: false,
        splashFunction: function() {}
    };

    //cookie
    var getCookie = function() {
        if( jpreOptions.onetimeLoad ) {
            var cookies = document.cookie.split('; ');
            for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
                if ((parts.shift()) === "jpreLoader") {
                    return (parts.join('='));
                }
            }
            return false;
        } else {
            return false;
        }

    };

    var setCookie = function(expires) {
        if( jpreOptions.onetimeLoad ) {
            var exdate = new Date();
            exdate.setDate( exdate.getDate() + expires );
            var c_value = ((expires==null) ? "" : "expires=" + exdate.toUTCString());
            document.cookie="jpreLoader=loaded; " + c_value;
        }
    };

    //create jpreLoader UI
    var createContainer = function() {

        $('body').css({
            display: 'block',
            opacity: 1
        });

        jOverlay = $('<div></div>')
            .attr('id', 'jpreOverlay')
            .css({
                position: "fixed",
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999999
            })
            .appendTo('body');

        if(jpreOptions.showSplash) {
            jContent = $('<div></div>')
                .attr('id', 'jpreSlide')
                .appendTo(jOverlay);

            var conWidth = $(window).width() - $(jContent).width();
            $(jContent).css({
                position: "absolute",
                top: jpreOptions.splashVPos,
                left: Math.round((50 / $(window).width()) * conWidth) + '%'
            });
            $(jContent).html($(jpreOptions.splashID).wrap('<div/>').parent().html());
            $(jpreOptions.splashID).remove();
            jpreOptions.splashFunction()
        }

        jLoader = $('<div></div>')
            .attr('id', 'jpreLoader')
            .appendTo(jOverlay);

        // modern loader
        mLoader = $('<div></div>')
            .attr('id', 'jpreMLoader')
            .appendTo(jLoader);

        for(var ij = 1; ij < 4; ij++)
            mLoader.append('<div class="bounce'+ij+'"></div>');
        // end: modern loader

        var posWidth = $(window).width() - $(jLoader).width();
        $(jLoader).css({
            position: 'absolute',
            top: jpreOptions.loaderVPos,
            left: Math.round((50 / $(window).width()) * posWidth) + '%'
        });

        jBar = $('<div></div>')
            .attr('id', 'jpreBar')
            .css({
                width: '0%',
                height: '100%'
            })
            .appendTo(jLoader);

        if(jpreOptions.showPercentage) {
            jPer = $('<div></div>')
                .attr('id', 'jprePercentage')
                .css({
                    position: 'relative',
                    height: '100%'
                })
                .appendTo(jLoader)
                .html('0%');
        }
        if( !jpreOptions.autoclose ) {
            jButton = $('<div></div>')
                .attr('id', 'jpreButton')
                .on('click', function() {
                    loadComplete();
                })
                .css({
                    position: 'relative',
                    height: '100%'
                })
                .appendTo(jLoader)
                .text(jpreOptions.closeBtnText)
                .hide();
        }
    };

    //get all images from css and <img> tag
    var getImages = function(element) {
        $(element).find('*:not(script)').each(function() {
            var url = "";

            if ($(this).css('background-image').indexOf('none') == -1 && $(this).css('background-image').indexOf('-gradient') == -1) {
                url = $(this).css('background-image');
                if(url.indexOf('url') != -1) {
                    var temp = url.match(/url\((.*?)\)/);
                    url = temp[1].replace(/\"/g, '');
                }
            } else if ($(this).get(0).nodeName.toLowerCase() == 'img' && typeof($(this).attr('src')) != 'undefined') {
                url = $(this).attr('src');
            }

            if (url.length > 0) {
                items.push(url);
            }
        });
    };

    //create preloaded image
    var preloading = function() {
        if(!items.length) completeLoading();

        for (var i = 0; i < items.length; i++) {
            if(loadImg(items[i]));
        }
    };

    var loadImg = function(url) {
        var imgLoad = new Image();
        $(imgLoad)
            .load(function() {
                completeLoading();
            })
            .error(function() {
                errors.push($(this).attr('src'));
                completeLoading();
            })
            .attr('src', url);
    };

    //update progress bar once image loaded
    var completeLoading = function() {
        current++;

        var per = (items.length) ? Math.round((current / items.length) * 100) : 100,
            pNumberStep = $.animateNumber.numberStepFactories.append('%');

        $(jBar).stop().animate({
            width: per + '%'
        }, 500, 'linear');

        if(jpreOptions.showPercentage) {
            $(jPer).stop().animateNumber({ number: per, numberStep: pNumberStep }, 'slow');
        }

        //if all images loaded
        if(current >= items.length) {
            current = items.length;
            setCookie();	//create cookie

            //fire debug mode
            if (jpreOptions.debugMode) {
                var error = debug();
            }

            //max progress bar
            $(jBar).stop().animate({
                width: '100%'
            }, 500, 'linear', function() {
                //autoclose on
                if( jpreOptions.autoClose ) {
                    setTimeout(loadComplete, 500);
                } else
                    $(jButton).fadeIn(1000);
            });
        }
    };

    //triggered when all images are loaded
    var loadComplete = function() {
        onComplete(); //callback function
        $(jOverlay).fadeOut(300, function() {
            $(jOverlay).remove();
        });
    };

    //debug mode
    var debug = function() {
        if(errors.length > 0) {
            var str = 'ERROR - IMAGE FILES MISSING!!!\n\r'
            str	+= errors.length + ' image files cound not be found. \n\r';
            str += 'Please check your image paths and filenames:\n\r';
            for (var i = 0; i < errors.length; i++) {
                str += '- ' + errors[i] + '\n\r';
            }
            return true;
        } else {
            return false;
        }
    };

    $.fn.jpreLoader = function(options, callback) {
        if(options) {
            $.extend(jpreOptions, options );
        }
        if(typeof callback === 'function') {
            onComplete = callback;
        }

        // start timer
        startTime = new Date().getMilliseconds();

        //show preloader once JS loaded
        $('body').css({
            display: 'block',
            opacity: 0
        });

        return this.each(function() {
            if( !(getCookie()) ) {
                createContainer();
                getImages(this);
                preloading();
            }
            else {	//onetime load / cookie is set
                $(jpreOptions.splashID).remove();
                setTimeout(function() {
                    $('body').animate({opacity: 1}, 'fast');
                    onComplete();
                }, 300);
            }
        });
    };

})(jQuery);