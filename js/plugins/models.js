(function(core, moment) {
	'use strict';

	core.register('plugins/models', function(context) {

		/* ====== Base model definition =======*/
		function Model(searchResult) {
			var images;
			if (searchResult) {
				this.externalId = searchResult.mbid || searchResult.externalId;
				if (searchResult.image) {
					this.images = searchResult.image.map(function(imgData) {
						return {
							size: imgData.size,
							url: imgData['#text']
						};
					});
					images = {};
					searchResult.image.forEach(function(imgData) {
						images[imgData.size] = imgData['#text'];
					});
					this.images = images;
				}
			} else {
				this.parent = Model;
			}
		}
		Model.prototype.getThumb = function() {
			if (this.images) {
				return this.images[1].url;
			}
		};
		Model.prototype.getImageUrl = function(size) {
			var result = '', i, len;
			if (this.images) {
				for (i = 0, len = this.images.length; i < len; i++) {
					if (this.images[i].size === size) {
						result = this.images[i].url;
						break;
					}
				}
			}
			return result;
		};
		/*Model.search = function(query, options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}
			
			seeker.search(query, this.constructor, options, callback);
		};*/

		/* ====== Track model definition ====== */
		function Track(searchResult) {
			this.parent(searchResult);
			this.title = searchResult.name || searchResult.title;
			this.artist = searchResult.artist;
			this.album = searchResult.album;
			this.duration = moment().startOf('day').add(moment.duration({s: searchResult.duration})).format('mm:ss');
			if (!this.externalId) {
				this.externalId = 'lfm|#|' + this.title + '|#|' + this.artist;
			}
		}
		Track.prototype = new Model();
		Track.prototype.toString = function() {
			return 'Track: ' + this.title + ' by ' + this.album;
		};


		/* ====== Album model definition ====== */
		function Album(searchResult) {
			this.parent(searchResult);
			this.title = searchResult.name;
			this.artist = searchResult.artist;
			if (searchResult.releasedate && searchResult.releasedate.length > 4) {
				this.releaseDate = moment(searchResult.releasedate.trim(), 'D MMM YYYY, HH:mm'); // 31 May 1994, 00:00
				this.releaseYear = this.releaseDate.format('YYYY');
			}
			if (searchResult.tracks) {
				var albumTracks = [],
					rawTracks = (Array.isArray(searchResult.tracks.track) ? searchResult.tracks.track : [searchResult.tracks.track]);
				rawTracks.forEach(function(t) {
					albumTracks.push(new Track({
						externalId: t.mbid,
						title: t.name,
						duration: t.duration,
						artist: t.artist.name,
						album: this.title
					}));
				}, this);
				this.tracks = albumTracks;
			}
		}
		Album.prototype = new Model();
		Album.prototype.toString = function() {
			return 'Album: ' + this.title + ' by ' + this.artist;
		};

		/*
		Album.search = function(query, options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			seeker.search(query, Album, options, callback);
		};

		Album.prototype.getInfo = function(options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			seeker.getInfo(this.externalId, Album, callback);
		};
		*/


		/* ====== Artist model definition ====== */
		function Artist(searchResult) {
			this.parent(searchResult);
			if (searchResult) {
				this.name = searchResult.name;
			}
		}
		Artist.prototype = new Model();
		Artist.prototype.toString = function() {
			return 'Artist: ' + this.name;
		};

		/*
		Artist.search = function(query, options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			seeker.search(query, Artist, options, callback);
		};

		Artist.prototype.getInfo = function(artistId, options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			seeker.getInfo(artistId, Artist, callback);
		};
		*/

		// Public API
		return {
			Track: Track,
			Album: Album,
			Artist: Artist
		};
	});

}(window.MusicCenter, window.moment));