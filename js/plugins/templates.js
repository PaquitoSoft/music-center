(function(core, M) {
	'use strict';

	core.register('plugins/templates', ['plugins/dom'], function(context, dom) {

		var templatesCache = {};

		function render(templateId, data) {
			var tpl = templatesCache[templateId];

			if (!tpl) {
				tpl = dom.findById(templateId);
				if (tpl) {
					tpl = M.compile(tpl.content());
					templatesCache[templateId] = tpl;
				} else {
					throw new Error('Could not find any template with id #' + templateId + ' in the document');
				}
			}

			Object.keys(data).forEach(function(key) {
				if (Array.isArray(data[key])) {
					data[key] = data[key].map(function(arr, index) {
						arr.index = index;
						return arr;
					});
				}
			});

			return tpl(data);
		}

		// Public API
		return {
			render: render
		};

	});

}(window.MusicCenter, window.Mustache));