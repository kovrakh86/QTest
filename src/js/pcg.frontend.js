// ReSharper disable InconsistentNaming
// ReSharper disable UseOfImplicitGlobalInFunctionScope

var AccessWidget = require("./controls/access.widget");

function PcgFrontend() {
    this.init = function() {
        $.pcg = $.pcg || {};
        $.pcg.frontend = $.pcg.frontend || {};

        $.extend($.pcg.frontend, {
            accessWidget: new AccessWidget(),            
        });
    };
};

module.exports = new PcgFrontend();
