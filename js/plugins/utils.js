(function(core) {
	'use strict';
	
	core.register('plugins/utils', function(context) {

		function mergeObjects() {
			var result = {};

			Array.prototype.slice.call(arguments).forEach(function(obj) {
				var item;
				if (obj) {
					for (item in obj) {
						result[item] = obj[item];
					}
				}
			});

			return result;
		}

		function param(object) {
			var result = [],
				item;

			for (item in object) {
				if (object.hasOwnProperty(item)) {
					Array.prototype.push.apply(result, [item, '=', object[item], '&']);
				}
			}

			result.pop();
			return result.join('');
		}

		// Public API
		return {
			merge: mergeObjects,
			param: param
		};
	});

}(window.MusicCenter));

/*
	From MOOTOOLS

	Browser.exec = function(text){
		if (!text) return text;
		if (window.execScript){
			window.execScript(text);
		} else {
			var script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.text = text;
			document.head.appendChild(script);
			document.head.removeChild(script);
		}
		return text;
	};

*/