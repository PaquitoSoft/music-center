(function(core, Q) {
	'use strict';

	core.register('plugins/goear', ['plugins/ajax'], function(context, ajax) {

		var SEARCH_BASE_URL = 'http://geproxy.eu01.aws.af.cm/search/{searchTerm}?timeout=2000&resultsCount=5&minQuality=128';

		function find(searchTerm) {
			var deferred = Q.defer(),
				_searchTerm = encodeURIComponent(searchTerm);

			ajax.getJson(SEARCH_BASE_URL.replace(/\{searchTerm\}/, _searchTerm)).then(function(data) {
				console.debug(data);
				deferred.resolve(data);
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		}

		function findSongs(track) {
			var deferred = Q.defer(),
				searchTerm = track.artist + ' ' + track.title;

			find(searchTerm).then(function(data) {
				if (!data.tracks.length) {
					// searchTerm = searchTerm.replace(/\(.*\).*\[.*\]/, '');
					searchTerm = searchTerm.replace(/\(.*\)/, '').replace(/\[.*\]/,''); // TODO WTF!!!
					find(searchTerm).then(function(data) {
						deferred.resolve(data);
					}, function(err) {
						deferred.reject(err);		
					});
				} else {
					deferred.resolve(data);
				}
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		}

		// Public API
		return {
			getSongUrls: findSongs
		};

	});

}(window.MusicCenter, window.Q));