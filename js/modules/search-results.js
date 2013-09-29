(function(core) {
	'use strict';
	
	core.register('searchResultsModule', ['plugins/events-manager', 'plugins/dom', 'plugins/templates', 'plugins/lastfm'],
		function SearchResultsModule(context, events, dom, templates, lastfm) {

		var $artistResults,
			$albumsResults,
			$artistsTabSelector,
			$albumsTabSelector,
			currentArtists,
			currentAlbums;

		function updateAlbumInfo(updatedAlbum) {
			var i, len;
			if (currentAlbums) {
				for (i = 0; len = currentAlbums.length, i < len; i++) {
					if (currentAlbums[i].title === updatedAlbum.title) {
						currentAlbums[i] = updatedAlbum;
						break;
					}
				}
			}
		}

		function listenToApp() {
			events.listen('new-search-results', function(searchResults) {
				if (searchResults && searchResults.length) {
					currentArtists = searchResults;
					$artistResults.content(templates.render('artistSearchResultTpl', {
						artists: searchResults
					}));
					$artistsTabSelector.click();
				} else {
					// TODO Tell the user we did not find anything
					alert('No artists found!');
				}
			});
		}

		function listenToDOM() {
			$artistResults.listen('click', 'title', function(event, $target) {
				var $artist = $target.parent('artist'),
					artistIndex = $artist.attr('data-index'),
					$artistAlbums = $artist.findEl('.subheader');

				if ($artistAlbums) {

					$albumsResults.content(templates.render('albumSearchResultTpl', {
						albums: currentArtists[artistIndex].albums
					}));
					$albumsTabSelector.click();

					currentAlbums = currentArtists[artistIndex].albums;
					currentArtists[artistIndex].albums.forEach(function(album, index) {
						lastfm.getAlbumInfo(album).then(function(fullAlbum) {
							var $album = dom.findEl('li.album[data-index="' + index +'"]');
							updateAlbumInfo(fullAlbum);
							$album.findEl('.subtitle')
								.content(templates.render('albumExtraInfoTpl', fullAlbum));
							$album.findEl('.actions').setStyle('visibility', 'visible');
						}, function(err) {
							console.warn('There was an error looking for an album details:', album.title, '--', err.message);
							console.error(err.stack);
						});
					});
				}
			});

			$albumsResults.listen('click', 'actionIcon', function(event, $target) {
				var albumIndex = $target.parent('album').attr('data-index');
				events.trigger('playAlbum', currentAlbums[albumIndex]);
			});
		}

		function init(context) {
			$artistResults = dom.findEl('#artistResults .results');
			$albumsResults = dom.findEl('#albumsResults .results');
			$artistsTabSelector = dom.findEl('*[data-tabcontent=artistResults]');
			$albumsTabSelector = dom.findEl('*[data-tabcontent=albumsResults]');

			dom.configureTabs(dom.findEl('#searchResults .row'));

			listenToApp();

			listenToDOM();
		}

		// Public API
		return {
			init: init
		};

	});

}(window.MusicCenter));