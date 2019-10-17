(function() {
    //FIX for IE: it doesn't support some mime-types(e.g. application/msword) passed through accept attribute
    $.validator.addMethod("accept", function(value, element, accept) {
        var typeParam, optionalValue, i, file, regex;

        optionalValue = this.optional(element);

        // Element is optional
        if (optionalValue) {
            return optionalValue;
        }

        if ($(element).attr("type") === "file") {

        // Escape string to be used in the regex
		// see: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
		// Escape also "/*" as "/.*" as a wildcard
            typeParam = accept
                .replace( /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&" )
                .replace( /,/g, "|" )
                .replace( /\/\*/g, "/.*" );

            // Check if the element has a FileList before checking each file
            if (element.files && element.files.length) {
                regex = new RegExp("(" + typeParam + ")$", "i");
                for (i = 0; i < element.files.length; i++) {
                    file = element.files[i];
                    // Grab the file extension from the loaded file, verify it matches
                    if (!file.name.match(regex)) {
                        return false;
                    }
                }
            }
        }

        // Either return true because we've validated each file, or because the
        // browser does not support element.files and the FileList feature
        return true;
    }, $.validator.format("Please enter a value with a valid mimetype."));
})();