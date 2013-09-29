(function(core, Q) {
	
	core.register('plugins/ajax', ['plugins/utils'], function(context, utils) {

		function send(url, options) {
			var req = new XMLHttpRequest(),
				deferred = Q.defer(),
				defaultOptions = {
					method: 'GET'/*,
					onSuccess: function(){
						console.debug('There was no handler registered to this request: ', this);
					},
					onError: function(){
						console.error('There was an error with your request: ', this.status);
					}*/
				};

			options = utils.merge(defaultOptions, options);

			req.open(options.method, url, true);

			req.onreadystatechange = function responseHandler() {
				if (req.readyState === 4) {
					if (req.status < 400 || (req.status === 0 && req.responseText)) {
						// options.onSuccess.call(req, req.responseText);
						deferred.resolve(req.responseText, req);
					} else {
						// options.onError.call(req, req.responseText);
						deferred.reject(req);
					}
				}
			};

			// TODO Is this only supported in new browsers??
			// req.onload = req.load = onload;
			// req.onerror = req.error = onerror;
			// req.onprogress = req.progress = onProgress;

			req.send(options.method === 'POST' ? options.body : null);

			return deferred.promise;
		}

		function sendGet(url, options) {
			return send(url, options);
		}

		function sendPost(url, options) {
			options.method = 'POST';
			return sendPost(url, options);
		}

		function requestJson(url, options) {
			var deferred = Q.defer();
			send(url, options).then(function(response, req) {
				deferred.resolve(JSON.parse(response), req);
			}, function(req) {
				deferred.reject(req);
			});
			return deferred.promise;
		}

		// public API
		return {
			send: send,
			get: sendGet,
			post: sendPost,
			getJson: requestJson
		};

	});

	console.debug("AJAX plugin registered!");

}(window.MusicCenter, window.Q));