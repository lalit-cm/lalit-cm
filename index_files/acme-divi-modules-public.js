(function( $ ) {
    'use strict';

    /**
     * Check if Divi Visual Builder is loaded
     *
     * @returns {boolean}
     */
    function isFrontBuilder() {
        if ($('.et-fb').length > 0)
            return true;
        return false;
    }

    /**
     * Quick Delay, so actions can override some Divi stuff
     */
    var waitForFinalEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
                clearTimeout (timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();


    /**
     * ONLOAD Launcher
     */
   // $(document).ready(function () {
    $(window).bind("load", function () {
        waitForFinalEvent(function () {
            if(false==isFrontBuilder())
                masonry_setup($('.acme_grid'));
            if($('.acme_carousel').length > 0) {
                var $et_pb_fullwidth_portfolio = $('.acme_carousel');
                $et_pb_fullwidth_portfolio.each(function () {
                    var set_container_height = $(this).hasClass('et_pb_fullwidth_portfolio_carousel') ? true : false;
                    if ( set_container_height ) {
                        set_fullwidth_portfolio_columns ( $ ( this ), set_container_height );
                    }
                    $('.et_pb_fullwidth_portfolio' ).attr('style','');
                });
            }
        }, 800, 'callbackID');
    });

    /**
     * ON WINDOW RESIZE Launcher
     */
    $(window).resize(function () {
        waitForFinalEvent(function () {
            if(false==isFrontBuilder())
                masonry_setup($('.acme_grid'));
            if($('.acme_carousel').length > 0) {
                var $et_pb_fullwidth_portfolio = $('.acme_carousel');
                $et_pb_fullwidth_portfolio.each(function () {
                    var set_container_height = $(this).hasClass('et_pb_fullwidth_portfolio_carousel') ? true : false;
                    if ( set_container_height ) {
                        set_fullwidth_portfolio_columns ( $ ( this ), set_container_height );
                    }
                    $('.et_pb_fullwidth_portfolio' ).attr('style','');
                });
            }
        }, 40, 'callbackID');
    });



    /*****************************
     * MASONRY *******************
     ****************************/


    /**
     *  Setup Mansonry Display Settings
     **/
    var MasonryOptions = {
        // options
        itemSelector: '.acme_grid-item',
        columnWidth: '.acme_grid_sizer',
        percentPosition: true,
        fitWidth: true,
        initLayout: true,
        resize: true
    };

    /**
     *  Setup column width for responsive design
     **/
    function masonry_colums_calc(obj){
        var columns;
        var defaults_columns = [1, 1, 1, 1, 1];
        var masonry_columns = obj.attr('data-acme-columns');
        var myWidth=obj.width();
        var my_columns = masonry_columns.split(',');
        // calculate column breakpoints
        if (myWidth >= 1600) {
            columns = my_columns[0] ? parseInt(my_columns[0]) : defaults_columns[0];
        } else if (myWidth >= 1024) {
            columns = my_columns[1] ? parseInt(my_columns[1]) : defaults_columns[1];
        } else if (myWidth >= 768) {
            columns = my_columns[2] ? parseInt(my_columns[2]) : defaults_columns[2];
        } else if (myWidth >= 480) {
            columns = my_columns[3] ? parseInt(my_columns[3]) : defaults_columns[3];
        } else {
            columns = my_columns[4] ? parseInt(my_columns[4]) : defaults_columns[4];
        }
        var size_container = parseInt(100 / columns);

        return size_container;
    }

    /**
     *  Launch Masonry
     **/
    function masonry_setup(obj) {
        var $grid = obj.masonry();
        $grid.masonry('destroy');
        obj.each(function () {
            var size_container = masonry_colums_calc($(this));
            $(this).find('.acme_grid_sizer').css('width', size_container + '%');
            $(this).find('.acme_grid-item').css('width', parseInt(size_container * 0.99) + '%');
            if(size_container<100) {
                $(this).find('.acme_grid-item--width2').css('width', parseInt(size_container * 1.98) + '%');
            }
            $grid.masonry(MasonryOptions);
        });
    }


    /*********************************
     *
     *  ACME FULL WIDTH PORTFOLIO ****
     *
     * @param $the_portfolio
     * @param carousel_mode
     * @returns {*}
     ********************************/
    function set_fullwidth_portfolio_columns( $the_portfolio, carousel_mode ) {

        var columns,
            $portfolio_items = $the_portfolio.find('.et_pb_portfolio_items'),
            portfolio_items_width = $portfolio_items.width(),
            $the_portfolio_items = $portfolio_items.find('.et_pb_portfolio_item'),
            portfolio_item_count = $the_portfolio_items.length;

        if ('undefined' === typeof $the_portfolio_items) {
            return;
        }
        var defaults_columns = [5, 4, 3, 2, 1];
        var max_columns= $the_portfolio.attr('data-max-columns');

        var my_columns = max_columns.split(',');

        // calculate column breakpoints
        if ( portfolio_items_width >= 1600 ) {
            columns = my_columns[0] ? parseInt(my_columns[0]) : defaults_columns[0];
        } else if ( portfolio_items_width >= 1024 ) {
            columns = my_columns[1] ? parseInt(my_columns[1]) : defaults_columns[1];
        } else if ( portfolio_items_width >= 768 ) {
            columns = my_columns[2] ? parseInt(my_columns[2]) : defaults_columns[2];
        } else if ( portfolio_items_width >= 480 ) {
            columns = my_columns[3] ? parseInt(my_columns[3]) : defaults_columns[3];
        } else {
            columns = my_columns[4] ? parseInt(my_columns[4]) : defaults_columns[4];
        }
        // set height of items
        var portfolio_item_width = portfolio_items_width / columns;
        var portfolio_item_height = 'auto';//portfolio_item_width * .75;

        if ( carousel_mode ) {
            $portfolio_items.css({ 'height' : portfolio_item_height });
        }

        $the_portfolio_items.css({ 'height' : portfolio_item_height });
        $the_portfolio.height($the_portfolio_items.height());
        //fix position of arrows at 50% of content height
        $('.et-pb-arrow-prev').css('top',$the_portfolio_items.height()/2);
        $('.et-pb-arrow-next').css('top',$the_portfolio_items.height()/2);



        if ( columns === $portfolio_items.data('portfolio-columns') ) {
            return;
        }

        if ( $the_portfolio.data('columns_setting_up') ) {
            return;
        }

        $the_portfolio.data('columns_setting_up', true );

        var portfolio_item_width_percentage = ( 100 / columns ) + '%';
        $the_portfolio_items.css({ 'width' : portfolio_item_width_percentage });

        // store last setup column
        $portfolio_items.removeClass('columns-' + $portfolio_items.data('portfolio-columns') );
        $portfolio_items.addClass('columns-' + columns );
        $portfolio_items.data('portfolio-columns', columns );

        if ( !carousel_mode ) {
            return $the_portfolio.data('columns_setting_up', false );
        }

        // kill all previous groups to get ready to re-group
        if ( $portfolio_items.find('.et_pb_carousel_group').length ) {
            $the_portfolio_items.appendTo( $portfolio_items );
            $portfolio_items.find('.et_pb_carousel_group').remove();
        }

        // setup the grouping
        var the_portfolio_items = $portfolio_items.data('items' ),
            $carousel_group = $('<div class="et_pb_carousel_group active">').appendTo( $portfolio_items );

        if ('undefined' === typeof the_portfolio_items) {
            return;
        }


        $the_portfolio_items.data('position', '');
        if ( the_portfolio_items.length <= columns ) {
            $portfolio_items.find('.et-pb-slider-arrows').hide();
        } else {
            $portfolio_items.find('.et-pb-slider-arrows').show();
        }
        for ( var position = 1, x=0 ;x < the_portfolio_items.length; x++, position++ ) {
            if ( x < columns ) {
                $( the_portfolio_items[x] ).show();
                $( the_portfolio_items[x] ).appendTo( $carousel_group );
                $( the_portfolio_items[x] ).data('position', position );
            } else {
                position = $( the_portfolio_items[x] ).data('position');
                $( the_portfolio_items[x] ).removeClass('position_' + position );
                $( the_portfolio_items[x] ).data('position', '' );
                $( the_portfolio_items[x] ).hide();
            }
        }

        $the_portfolio.data('columns_setting_up', false );

    }


})( jQuery );
