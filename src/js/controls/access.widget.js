/*
 * Assist fontsize JS module
 */
var AccessWidget = function () {
    var COOKIE_NAME = "assist_accessWidget";
    var currentContext = $(document);
    var moduleOptions = {
        fontSizes: {
            normal: "16px",
            large: "18px",
            largest: "20px"
        },
        cookie: null,
        styles: {
            normal: "normal",
            contrast: "contrast"
        },
        currentStyle: null,
        currentFontSize: null
    };

    var saveCookie = function () {
        $.cookie(COOKIE_NAME, moduleOptions.currentFontSize + "|" + moduleOptions.currentStyle, { expires: 100, path: '/' });
    };

    var setFontSize = function (size) {
        console.log("setFontSize");
        moduleOptions.currentFontSize = size;
        $("html").css("font-size", moduleOptions.fontSizes[size]);
        saveCookie();
    };

    var setStyleSheet = function (name) {
        console.log("setStyleSheet: ", name);
        moduleOptions.currentStyle = name;
        $(".js-contrast-style").each(function (i) {
            $(this).prop("disabled", true);
            if (moduleOptions.styles.contrast === name) {
                $(this).prop("disabled", false);
            }
        });
        saveCookie();
    };

    var setModuleOptions = function () {
        try {
            var myCookie = $.cookie(COOKIE_NAME);

            if (myCookie) {
                moduleOptions.cookie = myCookie.split("|");
                moduleOptions.currentFontSize = moduleOptions.cookie[0];
                moduleOptions.currentStyle = moduleOptions.cookie[1];
            } else {
                moduleOptions.currentFontSize = moduleOptions.fontSizes.normal;
                moduleOptions.currentStyle = moduleOptions.styles.normal;
            }
        }
        catch (e) {
            // Error handling
            console.log(e);
        }
    }

    var bindEventHandlers = function () {
        // font size events
        $('.js-fontsize-normal', currentContext).on('click', function (e) {
            e.preventDefault();
            setFontSize('normal');
        });
        $('.js-fontsize-medium', currentContext).on('click', function (e) {
            e.preventDefault();
            setFontSize('large');
        });
        $('.js-fontsize-large', currentContext).on('click', function (e) {
            e.preventDefault();
            setFontSize('largest');
        });
        // style events
        $('.js-switch-css-normal', currentContext).on('click', function (e) {
            e.preventDefault();
            setStyleSheet(moduleOptions.styles.normal);
        });
        $('.js-switch-css-contrast', currentContext).on('click', function (e) {
            e.preventDefault();
            setStyleSheet(moduleOptions.styles.contrast);
        });

    };

    this.init = function (context, options) {
        currentContext = context || currentContext;
        $.extend(moduleOptions, options);

        setModuleOptions();
        bindEventHandlers();

        setFontSize(moduleOptions.currentFontSize);
        setStyleSheet(moduleOptions.currentStyle);
    };

    return this;
};

module.exports = AccessWidget;
