(function(core, Q) {
	'use strict';

	core.register('plugins/lastfm', ['plugins/ajax', 'plugins/models','plugins/utils'], function LastFmPlugin(context, ajax, models, utils) {

		var LASTFM_BASE_URL = 'http://ws.audioscrobbler.com/2.0/?',
			LASTFM_API_KEY = 'b57b804c3dc371d824c9adac24b7e0a2';

		var modelToResourceMap = {};
		modelToResourceMap[models.Artist] = 'artist';
		modelToResourceMap[models.Album] = 'album';
		modelToResourceMap[models.Track] = 'track';

		function search(query, Klass, options) {
			var d = Q.defer(),
				resource = modelToResourceMap[Klass],
				reqOptions = utils.merge({
					method: resource + '.search',
					offset: 1,
					limit: 10,
					'api_key': LASTFM_API_KEY,
					format: 'json'
				}, options);

			reqOptions[resource] = query;

			ajax.getJson(LASTFM_BASE_URL + utils.param(reqOptions)).then(function(data/*, status, headers, config*/) {
				var rawResults, parsedResults = [];

				if (data.error) {
					console.info('Lastfm search request error: ', data);
					d.reject(new Error(data.message));
				} else {

					rawResults = data.results[resource + 'matches'][resource];

					if (!Array.isArray(rawResults)) {
						rawResults = [rawResults];
					}

					rawResults.forEach(function(rr) {
						parsedResults.push(new Klass(rr));
					});

					d.resolve(parsedResults);
				}

			}, function(data/*, status, headers, config*/) {
				console.info('Lastfm request error: ', data);
				d.reject(new Error(data.message));
			});

			return d.promise;
		}

		function getArtistAlbums(artist) {
			var d = Q.defer(),
				albums = [],
				reqOptions = {
					page: 1,
					limit: 20,
					method: 'artist.gettopalbums',
					format: 'json',
					'api_key': LASTFM_API_KEY
				};

			if (artist.externalId) {
				reqOptions.mbid = artist.externalId;
			} else {
				reqOptions.artist = artist.name;
			}

			ajax.getJson(LASTFM_BASE_URL + utils.param(reqOptions)).then(function(data) {
				var rawData;
				if (data.error) {
					d.reject(new Error(data.message));
				} else {
					rawData = data.topalbums.album;
					if (rawData) {
						if (!Array.isArray(rawData)) {
							rawData = [rawData];
						}
						rawData.forEach(function(ra) {
							albums.push(new models.Album(ra));
						});
					}
					d.resolve(albums);
				}

			}, function(data) {
				d.reject(new Error(data.message));
			});

			return d.promise;
		}

		function getAlbumInfo(album, options) {
			var d = Q.defer(),
				reqOptions = utils.merge({
					method: 'album.getinfo',
					offset: 1,
					limit: 10,
					'api_key': LASTFM_API_KEY,
					format: 'json'
				}, options);

			if (album.externalId) {
				reqOptions.mbid = album.externalId;
			} else {
				reqOptions.album = album.title;
				reqOptions.artist = album.artist.name;
			}

			ajax.getJson(LASTFM_BASE_URL + utils.param(reqOptions)).then(function(data) {
				if (data.error) {
					console.info('Lastfm get album info error: ', data);
					d.reject(new Error(data.message));
				} else {
					d.resolve(new models.Album(data.album));
				}
			}, function(data) {
				console.error('Lastfm get album info error: ', data);
				d.reject(new Error(data.message));
			});

			return d.promise;
		}

		function searchArtist(query, options) {
			var defer;

			if (options.withAlbums) {
				defer = Q.defer();

				search(query, models.Artist, options).then(function(artists) {
					var promises = artists.map(function(artist) {
						return getArtistAlbums(artist);
					});
					Q.allSettled(promises).then(function(results) {
						results.forEach(function(result, i) {
							if (result.state === 'fulfilled') {
								artists[i].albums = result.value;
							}
						});
						defer.resolve(artists);
					}, function(aErr) {
						defer.reject(aErr);
					});
				}, function(err) {
					defer.reject(err);
				});
				
				return defer.promise;
			} else {
				return search(query, models.Artist, options);
			}
		}

		function searchAlbum(query, options) {
			return search(query, models.Album, options);
		}

		return {
			searchArtist: searchArtist,
			searchAlbum: searchAlbum,
			getArtistAlbums: getArtistAlbums,
			getAlbumInfo: getAlbumInfo
		};

	});

}(window.MusicCenter, window.Q));

/*
	LAST.FM Error codes

	2 : Invalid service - This service does not exist
	3 : Invalid Method - No method with that name in this package
	4 : Authentication Failed - You do not have permissions to access the service
	5 : Invalid format - This service doesn't exist in that format
	6 : Invalid parameters - Your request is missing a required parameter
	7 : Invalid resource specified
	8 : Operation failed - Something else went wrong
	9 : Invalid session key - Please re-authenticate
	10 : Invalid API key - You must be granted a valid key by last.fm
	11 : Service Offline - This service is temporarily offline. Try again later.
	13 : Invalid method signature supplied
	16 : There was a temporary error processing your request. Please try again
	26 : Suspended API key - Access for your account has been suspended, please contact Last.fm
	29 : Rate limit exceeded - Your IP has made too many requests in a short period
*/
