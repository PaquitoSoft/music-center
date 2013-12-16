(function(core) {
	'use strict';
	
	core.register('playerModule', ['plugins/events-manager', 'plugins/dom', 'plugins/dom-element', 'plugins/templates', 'plugins/goear'],
		function PlayerModule(context, events, dom, Element, templates, goear) {

		var $mainEl,
			$currentTrack,
			$playlist,
			$player,
			currentAlbum,
			availableFiles,
			currentTrackIndex,
			currentFileIndex;

		function togglePlaylistView() {
			if ($playlist.data('visible')) {
				$playlist.setStyle('left', ($playlist.size().width * -1) + 'px');
				$playlist.data('visible', false);
			} else {
				$playlist.setStyle('left', '0px');
				$playlist.data('visible', true);
			}
		}

		function play(index, sanitize) {
			var track = currentAlbum.tracks[index],
				$track = $playlist.findEl('.track[data-index="' + index + '"]');
			if (track) {
				$currentTrack.content(templates.render('trackItemTpl', track));

				goear.getSongUrls(track).then(function(data) {
					if (track.files && track.files.length) {
						availableFiles = track.files;
						currentTrackIndex = index;
						currentFileIndex = 0;
						
						$player.el.src = availableFiles[currentFileIndex];
						$player.el.load();
						$player.el.play();
						
						$playlist.findEls('.track').forEach(function($track) {
							$track.removeClass('current');
						});
						$track.addClass('current');
						
					} else {
						// TODO Tell the user we did not find anything
						console.warn("PlayerModule::play# No file found for track:", track);
						play(currentTrackIndex++);
					}
				}, function(err) {
					console.warn('There was an error looking for a song links:', track);
					console.error(err.stack);
				});
			}
		}

		function listenToApp() {
			events.listen('playAlbum', function(album) {
				currentAlbum = album;

				// Create playlist
				$playlist.content(templates.render('playlistTpl', album));
				$playlist.setStyle('maxHeight', (document.documentElement.clientHeight - 300) + 'px');
				
				// Show for a short period of time
				if (!$playlist.data('visible')) {
					togglePlaylistView();
				}
				
				album.tracks.forEach(function(track, index) {
					goear.getSongUrls(track).then(function(data) {
						if (data.tracks.length) {
							var $track = $playlist.findEl('.track[data-index="' + this + '"]');
							currentAlbum.tracks[this].files = data.tracks.map(function(gt) {
								return gt.link;
							});
							if (data.tracks.length < 2) {
								$track.findEl('.change').setStyle('display', 'none');
							}
							$track.findEl('.actions div').setStyle('visibility', 'visible');
							$track.findEl('.download').attr('href', currentAlbum.tracks[this].files[0]);
							if (this === 0) {
								play(0);
							}
						}
					}.bind(index), function(err) {
						console.warn('PlayerModule::listenToApp::playAlbum# No files for track:', album.tracks[this]);
					}.bind(index));
				});
			});
		}

		function listenToDOM() {
			$mainEl.findEl('.currentTrack').listen('click', togglePlaylistView);

			$playlist.listen('click', 'play', function(event, $target) {
				play($target.parent('track').attr('data-index'));
			});

			$playlist.listen('click', 'change', function(event, $target) {
				if ($target.parent('track').attr('data-index') == currentTrackIndex) {
					console.debug('Available files:', availableFiles);
					if (availableFiles && availableFiles.length > 1) {
						console.debug('Current file:', availableFiles[currentFileIndex]);
						currentFileIndex = (currentFileIndex >= availableFiles.length - 1) ? 0 : currentFileIndex + 1;
						console.debug('New file:', availableFiles[currentFileIndex]);


						// TODO DRY!!!
						$player.el.src = availableFiles[currentFileIndex];
						$player.el.load();
						$player.el.play();
						// TODO Change download link
					}
				}
			});
		}

		function configurePlayer() {
			$player.listen('ended', function() {
				console.info('PlayerModule::configurePlayer# Song has finished!!!');
				if (++currentTrackIndex < currentAlbum.tracks.length) {
					play(currentTrackIndex);
				}
			});
		}

		function init(mainEl) {
			$mainEl = new Element(mainEl);
			$currentTrack = $mainEl.findEl('.currentTrack');
			$playlist = $mainEl.findEl('.playlist');
			$player = dom.findEl('#player .audio');

			configurePlayer();

			listenToApp();

			listenToDOM();
		}

		// Public API
		return {
			init: init
		};

	});

}(window.MusicCenter));