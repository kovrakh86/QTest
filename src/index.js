// CSS
require("./scss/styles.scss");
require("./scss/styles.backoffice.scss");
require("./scss/contrast.scss");

// JS
require("jquery");

// NOTE: it MUST BE used instead of $ and jQuery on views, $ and jQuery can be safely used inside our modules as these aliases will point to jQuery instance in webpack closure, not to global jquery object
global.$jquery = require("jquery");

// NOTE: if somebody has already provided instance of $ before us, we shouldn't override it, if not - then expose our instance
if (!global.$ || !global.jQuery) {
    global.$ = global.jQuery = global.$jquery;
}

require("slick-carousel");
require("jquery-validation");
require("jquery-validation/dist/additional-methods");
require("jquery-validation-unobtrusive");

require("bootstrap");

require("./js/extensions/jquery.extensions");
require("./js/extensions/jquery.validation.extensions");
require("./js/pcg.frontend").init();
