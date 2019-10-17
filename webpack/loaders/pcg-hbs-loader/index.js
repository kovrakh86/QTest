"use strict";

var path = require("path");
var loaderUtils = require("loader-utils");

var hbs = require("handlebars");

var HbsUtils = require("./utils/hbsUtilities");
var PartialsFinder = require("./utils/partialsFinder");
var AssetsMap = require("./utils/assetsMap");

module.exports = function(source) {
    var self = this;

    var handlebars = hbs.create();

    var hbsUtils = new HbsUtils();
    var partialsFinder = new PartialsFinder();
    var assetsMap = new AssetsMap();
    
    // Config
    var options = Object.assign({}, {
        helpers: [],
        partials: []
    }, loaderUtils.getOptions(self));

    if (self.cacheable) self.cacheable(true);
    
    // Register helpers
    options.helpers.forEach(helper => handlebars.registerHelper(helper(handlebars)));

    var partials = [];

    source = hbsUtils.stripComments(source);
    
    source = assetsMap.build(this.resource, source);

    // Find partials by source
    partialsFinder.findPartials(this.resource, source, partials)

    // Find partials by options
    options.partials.forEach(partial => partialsFinder.add(partial, partials));

    //Make alias unique
    source = partialsFinder.makeAliasUnique(this.resource, source, partials);
    partials.forEach(partial => {
        partial.content = partialsFinder.makeAliasUnique(partial.path, partial.content, partials);
    });

    //Register in handlebars as partial and loader as dependecy
    partials.forEach(partial => {
        self.addDependency(partial.normalizedPath); 
        var parsedPartial = assetsMap.build(partial.path, partial.content);
        handlebars.registerPartial(partial.id, parsedPartial);
    });

    //Compile template
    var template = handlebars.compile(source);
    var html = template();

    //Return result and require assets
    return "module.exports = " + assetsMap.release(JSON.stringify(html));
};