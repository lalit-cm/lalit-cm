(function ($) {
    'use strict';

    window.DSSuit = {};

    window.DSSuit.get_responsive_css = function (props, property, css_selector, css_property, important) {
        var css = [];

        const responsive_active = props[property + "_last_edited"] && props[property + "_last_edited"].startsWith("on");

        var declaration_desktop = "";
        var declaration_tablet = "";
        var declaration_phone = "";
        const is_important = important ? "!important" : "";

        switch (css_property) {
            case "margin":
            case "padding":
                if (props[property]) {
                    var values = props[property].split("|");
                    declaration_desktop = `${css_property}-top: ${values[0]}${is_important};
                                           ${css_property}-right: ${values[1]}${is_important};
                                           ${css_property}-bottom: ${values[2]}${is_important};
                                           ${css_property}-left: ${values[3]}${is_important};`;
                }

                if (responsive_active && props[property + "_tablet"]) {
                    var values = props[property + "_tablet"].split("|");
                    declaration_tablet = `${css_property}-top: ${values[0]}${is_important};
                                          ${css_property}-right: ${values[1]}${is_important};
                                          ${css_property}-bottom: ${values[2]}${is_important};
                                          ${css_property}-left: ${values[3]}${is_important};`;
                }

                if (responsive_active && props[property + "_phone"]) {
                    var values = props[property + "_phone"].split("|");
                    declaration_phone = `${css_property}-top: ${values[0]}${is_important};
                                         ${css_property}-right: ${values[1]}${is_important};
                                         ${css_property}-bottom: ${values[2]}${is_important};
                                         ${css_property}-left: ${values[3]}${is_important};`;
                }
                break;
            default: //Default is applied for values like height, color etc.
                declaration_desktop = `${css_property}: ${props[property]}${is_important};`;
                declaration_tablet = `${css_property}: ${props[property + "_tablet"]}${is_important};`;
                declaration_phone = `${css_property}: ${props[property + "_phone"]}${is_important};`;
        }

        css.push({
            selector: css_selector,
            declaration: declaration_desktop,
        });

        if (props[property + "_tablet"] && responsive_active) {
            css.push({
                selector: css_selector,
                declaration: declaration_tablet,
                device: 'tablet',
            });
        }

        if (props[property + "_phone"] && responsive_active) {
            css.push({
                selector: css_selector,
                declaration: declaration_phone,
                device: 'phone',
            });
        }


        return css;
    }

    window.DSSuit.get_border_css = function (props, suffix, border_radii_selector, border_styles_selector) {
        var css = [];

        if (suffix && '' !== suffix && 'default' !== suffix) {
            suffix = '_' + suffix;
        } else {
            suffix = '';
        }

        /** Border Radius */
        const border_radii = props["border_radii" + suffix] ? props["border_radii" + suffix].split("|") : [];
        css.push({
            selector: border_radii_selector,
            declaration: `border-top-left-radius: ${border_radii[1]}; border-top-right-radius: ${border_radii[2]}; border-bottom-right-radius: ${border_radii[3]}; border-bottom-left-radius: ${border_radii[4]};`,
        });

        /** Border Width */
        const width_top = props["border_width_top" + suffix] || props["border_width_all" + suffix];
        const width_right = props["border_width_right" + suffix] || props["border_width_all" + suffix];
        const width_bottom = props["border_width_bottom" + suffix] || props["border_width_all" + suffix];
        const width_left = props["border_width_left" + suffix] || props["border_width_all" + suffix];

        css.push({
            selector: border_styles_selector,
            declaration: `border-top-width: ${width_top}; border-right-width: ${width_right}; border-bottom-width: ${width_bottom}; border-left-width: ${width_left};`,
        });

        /** Border Style */
        const style_top = props["border_style_top" + suffix] || props["border_style_all" + suffix] || 'solid';
        const style_right = props["border_style_right" + suffix] || props["border_style_all" + suffix] || 'solid';
        const style_bottom = props["border_style_bottom" + suffix] || props["border_style_all" + suffix] || 'solid';
        const style_left = props["border_style_left" + suffix] || props["border_style_all" + suffix] || 'solid';

        css.push({
            selector: border_styles_selector,
            declaration: `border-top-style: ${style_top}; border-right-style: ${style_right}; border-bottom-style: ${style_bottom}; border-left-style: ${style_left};`,
        });

        /** Border Color */
        const color_top = props["border_color_top" + suffix] || props["border_color_all" + suffix];
        const color_right = props["border_color_right" + suffix] || props["border_color_all" + suffix];
        const color_bottom = props["border_color_bottom" + suffix] || props["border_color_all" + suffix];
        const color_left = props["border_color_left" + suffix] || props["border_color_all" + suffix];

        css.push({
            selector: border_styles_selector,
            declaration: `border-top-color: ${color_top}; border-right-color: ${color_right}; border-bottom-color: ${color_bottom}; border-left-color: ${color_left};`,
        });

        return css;
    }

    window.DSSuit.fix_et_db_et_boc_body_css = async function () {
        try {
            let $style = $("#et-builder-module-design-cached-inline-styles");
            let fixedText = $style.text().replace(/\.et-db #et-boc body/g, "body");
            $style.text(fixedText);
        } catch (error) {
            console.log("Battle Suit for Divi failed to fix the broken css", error);
        }
    }

    window.DSSuit.dss_lightbox_on_blurb = function (selector) {
        if (typeof $.magnificPopup === "undefined") {
            // console.log("MagnificPopup has not yet loaded. Re-trying in 300ms");
            setTimeout(function () {
                window.DSSuit.dss_lightbox_on_blurb(selector);
            }, 500);
            return;
        }

        try {
            let $module = $(selector.split(" ").join("."));
            let $image = $module.find(".et_pb_image_wrap img");
            let url = $image.attr("src");
            $image.magnificPopup({
                type: 'image',
                items: {
                    src: url
                }
            });
        } catch (error) {
            console.log("Error while setting up lightbox on blurb", error);
        }
    }

    $.fn.dss_hover_link_double_tap = function (params) {

        if (!('ontouchstart' in window) &&
            !navigator.msMaxTouchPoints &&
            !navigator.userAgent.toLowerCase().match(/windows phone os 7/i)) return false;

        this.each(function () {
            var curItem = false;

            $(this).on('click', function (e) {
                var item = $(this);
                if (item[0] != curItem[0]) {
                    e.preventDefault();
                    curItem = item;
                }
            });

            $(document).on('click touchstart MSPointerDown', function (e) {
                var resetItem = true,
                    parents = $(e.target).parents();

                if ($(e.target)[0] == curItem[0]) {
                    return;
                }

                for (var i = 0; i < parents.length; i++) {
                    if (parents[i] == curItem[0]) {
                        resetItem = false;
                    }
                }

                if (resetItem)
                    curItem = false;
            });
        });
        return this;
    };

    $.fn.dss_masonry_gallery = function (params) {
        let $this = $(this);
        if (typeof $.magnificPopup === "undefined") {
            setTimeout(function () {
                $this.dss_masonry_gallery(params);
            }, 300);
            return;
        }

        var masonry = $this.masonry({
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer',
            percentPosition: true,
        });


        $this.find('.grid-item a').magnificPopup({
            type: 'image',
            removalDelay: 500,
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                tCounter: '%curr% / %total%'
            },
            mainClass: 'mfp-fade',
            zoom: {
                enabled: true,
                duration: 500,
                opener: function (element) {
                    return element.find('img');
                }
            },
            autoFocusLast: false,
            image: {
                verticalFit: true,
                titleSrc: function (item) {
                    let title = "";
                    if (item.el.attr('data-title')) {
                        title += item.el.attr('data-title');
                    }
                    if (item.el.attr('data-caption')) {
                        title += "<small class='dss_masonry_gallery_caption'>" + item.el.attr('data-caption') + "</small>";
                    }
                    return title;
                }
            },
        });

        var layout = $.debounce(250, function () {
            masonry.masonry('layout');
        });

        if ($this.attr("data-lazy") === "true") {
            var observer = new MutationObserver(layout);
            var config = { attributes: true, childList: true, subtree: true };
            observer.observe($this[0], config);
        } 
        
        masonry.imagesLoaded().progress(layout);

        return masonry.masonry('layout');
    };

    $(document).ready(function () {
        $(".dss_bucket .dss_bucket_link").dss_hover_link_double_tap();
        $(".dss_masonry_gallery").each(function () {
            $("." + $(this).attr("class").replace(/ /g, ".") + " .grid").dss_masonry_gallery();
        });
        window.DSSuit.fix_et_db_et_boc_body_css();
    });

})(jQuery);


