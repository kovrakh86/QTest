var fs = require("fs");
var path = require("path");

var HbsUtilities = require("./hbsUtilities");

var PartialsFinder = function() {
	var self = this;
	var hbsUtilities = new HbsUtilities();

	const resolvePath = (contentPath, partialAlias) => path.resolve(path.dirname(contentPath), `${partialAlias}.hbs`);

	const partialRegEx = /(\{\{>\s?)(\.{1,2}[^\s}]+)/g;
	const getPartials = (content) => {
		var partials = [];
		var partialMatch; 
	
		while (partialMatch = partialRegEx.exec(content)) {
			var partial = partialMatch[2]; //path relative to template
			partials.push(partial);
		};

		return partials;
	}

	const readPartial = (partialPath) => 
	{
		var content = fs.readFileSync(partialPath, "utf8");
		var stripped = hbsUtilities.stripComments(content);
		return stripped;
	}

	this.add = (partial, partials) => {
		partial.content = readPartial(partial.path);
		partial.normalizedPath = partial.path.split("/").join("\\");// workaround for webpack watcher
        partials.push(partial);
        self.findPartials(partial.path, partial.content, partials)
	};

	this.findPartials = (contentPath, content, partials) => {
		var partials = partials || [];
	
		getPartials(content).forEach(partialAlias => {
			var partialPath = resolvePath(contentPath, partialAlias);
			var partialContent = readPartial(partialPath);
	
			var partial = {
				id: `partial_${Math.random()}${Math.random()}`.replace(/\./g, ""), //partial aliases must be unique as relative path may be not unique
				alias: partialAlias,
				path: partialPath,
				normalizedPath: partialPath.split("/").join("\\"),
				content: partialContent,
				parent: contentPath
			};
			partials.push(partial);
	
			self.findPartials(partial.path, partial.content, partials);
		});
	
		return partials;
	};

	this.makeAliasUnique = (contentPath, content, partials) => {
		var nestedPartials = partials.filter(p => p.parent === contentPath);
		return content.replace(partialRegEx, (match) => {
			var index = nestedPartials.map(p =>`{{> ${p.alias}`).indexOf(match);
			if(index < 0) return match;
			return `{{> ${nestedPartials[index].id}`;
		});
	}
};

module.exports = PartialsFinder;