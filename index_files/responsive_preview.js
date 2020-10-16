(function ($) {
    'use strict';

    $(document).ready(function () {

        if (!window.ET_Builder) {
            return;
        }

        var buttons_added = false;

        function add_size_buttons(size) {
            if (buttons_added) { return; }
            buttons_added = true;

            const settingsBarSelector = ".et-fb-page-settings-bar .et-fb-page-settings-bar__column.et-fb-page-settings-bar__column--left .et-fb-button-group:first-of-type";
            const settingsBar = $(settingsBarSelector);

            if ("phone" === size) {
                settingsBar.append('<button type="button" data-size="xs" class="et-fb-button et-fb-button--inverse et-fb-button--app-modal dss_mobile_preview_button">XS</button>');
            }

            settingsBar.append('<button type="button" data-size="s" class="et-fb-button et-fb-button--inverse et-fb-button--app-modal dss_mobile_preview_button">S</button>');
            settingsBar.append('<button type="button" data-size="m" class="et-fb-button et-fb-button--inverse et-fb-button--app-modal dss_mobile_preview_button">M</button>');
            settingsBar.append('<button type="button" data-size="l" class="et-fb-button et-fb-button--inverse et-fb-button--app-modal dss_mobile_preview_button">L</button>');

            if ("phone" === size) {
                settingsBar.append('<button type="button" data-size="xl" class="et-fb-button et-fb-button--inverse et-fb-button--app-modal dss_mobile_preview_button">XL</button>');
            }

            if ("phone" === size) {
                // mache ppone m button green
                $('button.dss_mobile_preview_button[data-size="l"]').css("color", "rgb(112, 195, 169)");
            } else if ("tablet" === size) {
                // mache tab s button green
                $('button.dss_mobile_preview_button[data-size="s"]').css("color", "rgb(112, 195, 169)");
            }
        }

        function remove_size_buttons() {
            $(".dss_mobile_preview_button").remove();
            buttons_added = false;
        }

        function is_tablet_preview() {
            return $("html").hasClass("et_fb_preview_active--responsive_preview--tablet_preview") ||
                $("html").hasClass("et-fb-preview--tablet");
        }

        function is_phone_preview() {
            return $("html").hasClass("et_fb_preview_active--responsive_preview--phone_preview") ||
                $("html").hasClass("et-fb-preview--phone");
        }

        const html = $("html");
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (is_tablet_preview()) {
                    remove_size_buttons();
                    add_size_buttons("tablet");
                } else if (is_phone_preview()) {
                    remove_size_buttons();
                    add_size_buttons("phone");
                } else {
                    remove_size_buttons();
                }
            });
        });
        observer.observe(html.get(0), { attributes: true });


        $("body").on("click", ".dss_mobile_preview_button", (e) => {
            $('.dss_mobile_preview_button').css("color", "");
            $(e.currentTarget).css("color", "rgb(112, 195, 169)");
            var width = "";
            var containerSelector = "";
            if (is_phone_preview()) {
                switch (e.currentTarget.dataset.size) {
                    case "xs":
                        width = "320px";
                        break;
                    case "s":
                        width = "375px";
                        break;
                    case "m":
                        width = "425px";
                        break;
                    case "l":
                        width = "493px";
                        break;
                    case "xl":
                        width = "767px";
                        break;
                    default:
                        break;
                }

                containerSelector = ".et_fb_preview_active--responsive_preview--phone_preview .et_fb_preview_container";
            }

            if (is_tablet_preview()) {
                switch (e.currentTarget.dataset.size) {
                    case "s":
                        width = "793px";
                        break;
                    case "m":
                        width = "880px";
                        break;
                    case "l":
                        width = "980px";
                        break;
                    default:
                        break;
                }

                containerSelector = ".et_fb_preview_active--responsive_preview--tablet_preview .et_fb_preview_container";
            }

            $(containerSelector).animate({ "max-width": width }, { duration: 1000, easing: 'easeOutElastic' });
            $("#et-fb-app-frame").animate({ "width": width }, { duration: 1000, easing: 'easeOutElastic' });
        });
    });

})(jQuery);
