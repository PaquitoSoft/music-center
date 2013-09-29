(function(core) {
	'use strict';
	
	core.register('seekerModule', ['plugins/events-manager', 'plugins/dom', 'plugins/dom-element', 'plugins/lastfm'], function SeekerModule(context, events, dom, Element, lastFm) {

		var $mainEl,
			$searchText;

		function searchHandler(event) {
			event.preventDefault();
			
			lastFm.searchArtist($searchText.value(), { withAlbums: true }).then(function(artists) {
				events.trigger('new-search-results', artists);
			});
		}

		function init(mainEl) {
			var $searchForm;
			$mainEl = new Element(mainEl);
			$searchText = $mainEl.findEl('input[name="query"]');
			$searchForm = $mainEl.findById('searchForm');
			
			// Listen for form submission
			$searchForm.listen('submit', searchHandler);
		}

		// Public API
		return {
			init: init
		};

	});

}(window.MusicCenter));