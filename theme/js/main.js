/*! ===================================
 *  Author: BBDesign & WPHunters
 *  -----------------------------------
 *  Email(support):
 * 	bbdesign_sp@yahoo.com
 *  ===================================
 */


/*
 * Define functions
 * --------------------------------------------------
 */
var melicaJS = {

    // preloader & unloader
    InitPreloader: function() {
        'use strict';

        var $body = $('body');
        $body.jpreLoader({
            autoClose: true,
            loaderVPos: 0
                //onetimeLoad: true
        }, function() {
            $(window).trigger('jqOnLoad').trigger('srUpdate');
        });

        // fade out page after click
        $body.on('click', 'a:not([href=#])', function() {
            var $this = $(this),
                linkTarget = $this.attr('href');

            if ($this.attr('target') !== undefined) return true;
            if ($this.attr('data-toggle') !== undefined) return;
            if ($this.parents('[data-noajax]').length || $this.attr('data-noajax')) return true;

            $body.animate({
                opacity: 0
            }, 'fast', function() {
                location.href = linkTarget;
            });
            return false;
        });
    },


    // calculate footer margin to make it 'sticky'
    StickyFooter: function() {
        'use strict';

        var docHeight = 0,
            footer = $('#main-footer');
        if (footer.parents('.disable-sticky-footer').length) return;

        $('body > *').filter(':not(#main-footer,#jpreOverlay)').each(function() {
            var $this = $(this);
            if ($this.is(':visible')) docHeight += $this.height();
        });

        var calculatedHeight = $(window).height() - (docHeight + footer.height() + 44);
        footer.css('margin-top', (calculatedHeight <= 70) ? 70 : calculatedHeight);

    },


    // header logic
    HeaderInit: function() {
        'use strict';

        if ($.fn.tinyNav) {
            // mobile navigation select init
            $('#header ul.menu').tinyNav({
                header: 'Navigation'
            });

            // menu button action
            $('#menu-btn').on('click', function() {
                $('#header .tinynav:eq(0)').focus();
                return false;
            });
        }


        // search button
        var $form = $('#search-form'),
            $input = $form.find('input[type="text"]'),
            $searchBtn = $('#search-btn');
        $searchBtn.on('click', function() {

            if ($form.hasClass('open')) {
                $form.removeClass('open');
                $searchBtn.removeClass('fa-times-circle-o');
                $input.blur();
                return false;
            }

            // show form and focus on input
            $searchBtn.addClass('fa-times-circle-o');
            $input.focus();
            $form.addClass('open');

            return false;
        });


        // shadow processing
        var $window = $(window),
            $header = $('#header'),
            $headShadow = $header.find('.shadow:eq(0)');
        $window.on('scroll', function() {
            var scrollTop = $window.scrollTop(),
                opacityPref = Modernizr.prefixed('opacity');

            // article header opacity
            if (!Modernizr.touch && $window.width() >= 768) {
                var $aBG = $('.box-bg'),
                    aScrollTop = scrollTop / $aBG.height();

                if (aScrollTop > 1) {
                    aScrollTop = 1;
                    $aBG.hide();
                } else {
                    $aBG.show();
                }

                // safari fix
                if (aScrollTop < 0 && $.isSafari()) {
                    $aBG.addClass('ontop');
                } else {
                    $aBG.removeClass('ontop');
                }

                // apply style
                $aBG.css(opacityPref, 1 - aScrollTop);
            }


            // header shadow opacity
            scrollTop /= 100;
            if (scrollTop > 1) scrollTop = 1;
            $headShadow.css(opacityPref, scrollTop);
        });
    },


    // init big mainpage slider
    MainSliderInit: function() {
        'use strict';

        var $container = $('#slider-container');

        $container.on('init', function(evt) {
            var $slider = $(evt.target),
                $header = $('#header'),
                $window = $(window);

            $(window).on('resize', function() {
                var height = $window.height() - $header.outerHeight();
                $slider.find('.slick-slide').css('height', height);
            }).trigger('resize');
        });

        $container.slick({
            arrows: true,
            dots: true,
            fade: true,
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 5000
        });
    },


    // regular sliders
    InitSliderAPI: function() {
        'use strict';

        var $sliders = $('[data-slider]'),
            defaultSettings = {
                adaptiveHeight: true,
                autoplaySpeed: 5000,
                arrows: false,
                dots: false,
                slide: 'article, div'
            };

        $sliders.each(function() {
            var $this = $(this),
                settings = defaultSettings;

            if ($this.hasClass('vertical')) settings.vertical = true;
            if ($this.hasClass('with-arrows')) settings.arrows = true;
            if ($this.hasClass('autoplay')) settings.autoplay = true;

            $this.slick(settings);
        });
    },


    // init smart sliders API system
    InitSmartSliderAPI: function() {
        'use strict';

        var $sliders = $('.smart-slider'),
            defaultSettings = {
                adaptiveHeight: true,
                autoplaySpeed: 7500,
                autoplay: true,
                arrows: false,
                dots: false,
                pauseOnHover: false,
                swipe: false,
                touchMove: false,
                slide: 'article'
            };

        if (!$sliders) {
            return;
        }

        $sliders.each(function(index) {
            var $slider = $(this),
                sliderId = 'smslider-' + (index + 1),
                slideIndex = 0,
                isVertical = $slider.hasClass('vertical');

            // change classes
            $slider.removeClass('smart-slider vertical').addClass(sliderId);

            // populate sliders
            for (var i = 0; i < 2; i++) {
                $slider.clone()
                    .attr('id', '')
                    .insertAfter($slider);
            }

            // setup sliders
            $('.' + sliderId).each(function() {
                var $this = $(this),
                    settings = defaultSettings;

                settings.vertical = isVertical;
                settings.initialSlide = slideIndex++;
                $this.slick(settings).slick('slickPause');

                // run slider after delay
                setTimeout(function() {
                    $this.slick('slickPlay');
                }, slideIndex * 250);
            });
        });
    },


    // tabs system(based on slick slider)
    TabsInit: function() {
        'use strict';

        var tabs = $('[data-slick-tabs]');
        if (!tabs) return;

        tabs.each(function() {
            $(this).slick({
                arrows: false,
                adaptiveHeight: true,
                draggable: false,
                touchMove: false,
                swipe: false
            });
        });

        $('[data-toggle="slick-tab"]').on('click', function() {
            var $this = $(this),
                target = $($this.attr('href'));

            if (!target) return true;

            // turn slider
            var slideIndex = target.attr('data-slick-index');
            target.parents('.slick-slider').slick('slickGoTo', slideIndex);

            // switch active state
            $this.parents('li').addClass('active')
                .siblings().removeClass('active');
            return false;
        });
    },


    // forms validation
    FormsInit: function() {
        'use strict';

        if (!$.fn.isHappy) return;

        // default form submitting callback
        var defaultHappyFunction = function(mailchimp) {
            return function(e) {
                e.preventDefault(); // prevent form submission
                var $form = $(e.target);

                // enable lock-mode
                var box = $form.parents('.box.with-header')
                    .append('<i class="fa fa-spinner fa-spin lock-icon"></i>')
                    .addClass('lock');

                // lock all fields
                var fields = $form.find(':input:enabled').addClass('disabled');

                // use ajax to submit form data
                $.ajax($form.attr('action'), {
                    type: 'post',
                    data: $form.serialize(),
                    dataType: (mailchimp) ? 'jsonp' : 'html',
                    jsonp: 'c',

                    complete: function(xhr) {

                        var selector_ok = '.alert.alert-success',
                            selector_error = '.alert.alert-danger',
                            validateCond = (xhr.status !== 200);

                        // mailchimp validation
                        if (mailchimp) {
                            var response = xhr.responseJSON;
                            validateCond = (response && response.result !== 'success');
                            if (validateCond) xhr.responseText = response.msg;
                        }

                        // do things
                        setTimeout(function() {
                            if (validateCond) {
                                $(selector_ok, $form).fadeOut('fast');
                                $(selector_error, $form).find('span').html(xhr.responseText);
                                $(selector_error, $form).fadeIn('fast');
                            } else {
                                $(selector_error, $form).fadeOut('fast');
                                $(selector_ok, $form).fadeIn('fast');

                                // reset form
                                $form[0].reset();
                            }

                            box.removeClass('lock');
                            fields.removeClass('disabled');
                        }, 1000);
                    }
                });
            };
        };

        // contact form
        $('#contact_form').isHappy({
            classes: {
                field: 'has-error'
            },

            fields: {
                '#fullname_field': {
                    required: true,
                    test: formHappy.betweenLength,
                    arg: {
                        min: 3,
                        max: 150
                    }
                },

                '#email_field': {
                    required: true,
                    test: formHappy.email
                },

                '#message_field': {
                    required: true,
                    test: formHappy.betweenLength,
                    arg: {
                        min: 15,
                        max: 3000
                    }
                }
            },

            happy: defaultHappyFunction(false)
        });

        // subscribe form
        var subscribeForm = $('#subscribe_form');
        if (subscribeForm.length) subscribeForm.attr('action', subscribeForm.attr('action').replace('/post', '/post-json'));
        subscribeForm.isHappy({
            classes: {
                field: 'has-error'
            },
            fields: {
                '#sname_field': {
                    required: true
                },
                '#semail_field': {
                    required: true,
                    test: formHappy.email
                }
            },
            happy: defaultHappyFunction(true)
        });
    },


    // init scroll reveal animations API
    InitSR: function() {
        'use strict';

        if (typeof scrollReveal === 'undefined') return;

        var elems = $('.animate').find('> *'),
            count = elems.length;

        elems.each(function() {
            var $this = $(this),
                sequence = ($this.parents('.sequence').length) ? ' wait ' + $this.index() * 100 + 'ms' : '';

            $this.attr('data-sr', 'enter top' + sequence);

            // in the end - run scrollReveal engine
            if (!--count) {
                window.sr = new scrollReveal({
                    vFactor: 0.2
                });
            }
        });
    },


    // for galleries and images
    InitMagnificPopups: function() {
        'use strict';

        if (!$.fn.magnificPopup) return;

        // init regular modals
        $('.modal').magnificPopup({
            type: 'image',
            zoom: {
                enabled: !Modernizr.touch
            }
        });

        // galleries
        $('.modal-gallery').each(function() {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                zoom: {
                    enabled: !Modernizr.touch
                },
                gallery: {
                    enabled: true
                }
            });
        });
    },


    // awesome image grids ;)
    InitPhotoSets: function() {
        'use strict';

        if (!$.fn.photosetGrid) return;

        $('.photoset-grid').each(function() {
            var $this = $(this);

            // run grid builder
            $this.photosetGrid({
                onComplete: function() {

                    // attach gallery
                    $this.magnificPopup({
                        delegate: 'a',
                        type: 'image',
                        zoom: {
                            enabled: !Modernizr.touch
                        },
                        gallery: {
                            enabled: true
                        }
                    });
                }
            });
        });
    },


    // maps API
    InitGMaps: function() {
        'use strict';

        if (!google || !google.maps) return;

        // default options for map constructor
        var defaultOptions = {
            streetViewControl: false,
            scrollwheel: false,
            panControl: true,
            mapTypeControl: false,
            overviewMapControl: false,
            zoomControl: true,
            center: new google.maps.LatLng(40.805478, -73.96522499999998),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: true
        };

        //if(Modernizr.touch) defaultOptions['draggable'] = false;

        // loop through elements
        $('.place-map').each(function(mapIndex) {
            var $this = $(this),
                lat = parseFloat($this.data('lat')),
                long = parseFloat($this.data('long')),
                infoWindowContent = $this.html();

            $this.html(''); // clear element

            var elem_id = 'gmap_' + mapIndex;
            $this.append('<div id="' + elem_id + '" class="embed-responsive-item"/>');

            var options = $.extend(defaultOptions, {
                zoom: $this.data('zoom') || 14,
                center: new google.maps.LatLng(lat, long)
            });

            var map = new google.maps.Map(document.getElementById(elem_id), options);
            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(lat, long)
            });
            var infowindow = new google.maps.InfoWindow({
                content: infoWindowContent
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });

            google.maps.event.addListenerOnce(map, 'idle', function() {
                $this.addClass('initialized');
            });

            infowindow.open(map, marker);
        });
    },


    // awesome boxed layout
    InitMasonry: function() {
        'use strict';

        if (typeof Masonry === 'undefined') return;

        $('[data-masonry]').each(function() {
            var $this = $(this).addClass('msnry-row row');

            // reflow elements
            if ($this.data('masonry-loaded') !== undefined) {
                $this.masonry('layout');
                return;
            }

            var colClass = Math.floor(12 / $this.attr('data-masonry'));
            $this.find('> *').each(function() {
                $(this).wrap('<div class="msnry-item col-xs-12 col-md-' + colClass + '"/>');
            });

            $this.masonry({
                itemSelector: '.msnry-item'
            });

            $this.data('masonry-loaded', true);
        });
    }
};


/*
 * Run functions
 * --------------------------------------------------
 */
$(document).ready(function() {
    'use strict';

    FastClick.attach(document.body);

    // detect non-ios browsers
    if (!navigator.userAgent.match(/(iPod|iPhone|iPad)/)) $('html').addClass('non-ios');

    // detect safari browser
    $.isSafari = function() {
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1);
    };

    // transition end event name
    var transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
        'MozTransition': 'transitionend', // only for FF < 15
        'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
    };
    $.transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];


    // run functions
    melicaJS.InitPreloader();
    melicaJS.HeaderInit();

    // slick slider dependency check
    if ($.fn.slick) {
        melicaJS.MainSliderInit();
        melicaJS.InitSliderAPI();
        melicaJS.InitSmartSliderAPI();
        melicaJS.TabsInit();
    }

    melicaJS.FormsInit();
    melicaJS.InitSR();
    melicaJS.InitMagnificPopups();
    melicaJS.InitPhotoSets();
    melicaJS.InitGMaps();
});

$(window).on('load jqOnLoad', melicaJS.InitMasonry);
$(window).on('jqOnLoad resize', melicaJS.StickyFooter);
