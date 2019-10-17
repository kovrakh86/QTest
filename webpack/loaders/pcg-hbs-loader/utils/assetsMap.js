var path = require("path");
var urlUtils = require("url");
var loaderUtils = require("loader-utils");

var AttributesParser = require("./attributesParser");

var AssetsMap = function () {
	var self = this;
	var assetsMap = {}; //<id, url> storage for assets 

	var attributes = ["img:src", "div:style", "span:style", "a:style", "p:style", "header:style"];
	var attributesParser = new AttributesParser();

	const requireIdRegEx = /asset_[0-9]+/g;
	const getRequireId = () => `asset_${Math.random()}${Math.random()}`.replace(/\./g, "");

	const resolvePath = (contentPath, reqPath) => path.resolve(path.dirname(contentPath), reqPath).split("\\").join("/");

	const replacePathByRequireId = (source, reqId, start, length) => source.substr(0, start) + reqId + source.substr(start + length);

	const buildByAttributes = (contentPath, content) => {
		var attrs = attributesParser.parse(content, (tag, attr) => attributes.indexOf(tag + ":" + attr) >= 0);

		attrs.forEach(attr => {
			//handling inline styles (background-image: url('xxx'))
			var urlMatch = /url\('(.*)'\)/gi.exec(attr.value);
			if(urlMatch) {
				attr.start = attr.start + urlMatch.index + 5/*<- 'url(' length*/;
				attr.value = urlMatch[1];
				attr.length = attr.value.length;
			}

			//be safe
			if(!loaderUtils.isUrlRequest(attr.value, contentPath)) return;
			if(attr.value.indexOf(":") > 0) return;
			
			//handling assets with hash
			var uri = urlUtils.parse(attr.value);
			if (uri.hash !== null && uri.hash !== undefined) {
				uri.hash = null;
				attr.value = uri.format();
				attr.length = attr.value.length;
			}
	
			//set place holder for assets and save it to map
			var requireId = getRequireId();
			content = replacePathByRequireId(content, requireId, attr.start, attr.length);
			assetsMap[requireId] = resolvePath(contentPath, attr.value);
		});

		return content;
	};

	const buildByReqInterpolation = (contentPath, content) => {
		//Handle inline require statements: ${require('relative/path')}
		var reguireRegEx = /\$\{require\([^)]*\)\}/g;
		var result;
		var requireMap = [];
		while(result = reguireRegEx.exec(content)){
			requireMap.push({
				length : result[0].length,
				start : result.index,
				value : result[0]
			})
		}

		requireMap.forEach((req) => {
			var requireId = getRequireId();
			content = replacePathByRequireId(content, requireId, req.start, req.length);
			assetsMap[requireId] = resolvePath(contentPath, req.value.substring(11, req.length - 3));
		});

		return content;
	};

	this.build = (contentPath, content) => {
		content = buildByAttributes(contentPath, content);
		content = buildByReqInterpolation(contentPath, content);

		return content;
	};

	this.release = (content) => {
		//unwrap place holder by requiring the asset
		var result = content.replace(requireIdRegEx, (match) => {
			if(!assetsMap[match]) return match;
			return '" + require(' + JSON.stringify(loaderUtils.urlToRequest(assetsMap[match])) + ') + "';
		}) + ";";

		assetsMap = [];
		
		return result;
	};
};

module.exports = AssetsMap;