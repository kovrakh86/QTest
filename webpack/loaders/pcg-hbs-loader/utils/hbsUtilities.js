var HbsUtilities = function () {
	//strip html & hbs comments <!--x--> {{!-- x --}}
	this.stripComments = (template) => template.replace(/(\{\{|<)!--[\s\S]*?(?:--(>|}}))/g, '')
};

module.exports = HbsUtilities;