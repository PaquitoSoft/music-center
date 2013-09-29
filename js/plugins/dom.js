(function(core) {
	'use strict';
	
	core.register('plugins/dom', ['plugins/dom-element'], function DOMPlugin(mainContext, Element) {

		var $document = new Element(document),
			$loader = findEl('.loader');

		function findById(id) {
			return $document.findById(id);
		}

		function findEl(selector, $context) {
			$context = $context || $document;
			return $context.findEl(selector);
		}

		function findEls(selector, $context) {
			$context = $context || $document;
			return $context.findEls(selector);
		}

		function showEl($element, options) {
			if ($element) {
				$element.setStyle('display', 'none');
			}
		}

		function hideEl($element, options) {
			if ($element) {
				$element.setStyle('display', 'inherit');
			}
		}

		function configureTabs($parentEl) {
			var $tabsSelectors = $parentEl.findEls('.tab'),
				$tabsContents = $parentEl.findEls('.tabContent');
			
			$tabsSelectors.forEach(function($tabSelector, selIndex) {
				$tabSelector.listen('click', function(event) {
					var $target = new Element(event.currentTarget);
					event.preventDefault();
					$tabsSelectors.forEach(function($ts) {
						$ts.removeClass('active');
					});
					$target.addClass('active');
					$tabsContents.forEach(function($tabContent) {
						$tabContent.setStyle('display',
							$target.attr('data-tabContent') === $tabContent.attr('id') ? 'inherit' : 'none');
					});
				});
				
			});
		}

		function showLoader() {
			$loader.setStyle('visibility', 'visible');
			return $loader;
		}
		function hideLoader() {
			$loader.setStyle('visibility', 'hidden');
			return $loader;
		}

		// Public API
		return {
			findById: findById,
			findEl: findEl,
			findEls: findEls,
			showEl: showEl,
			hideEl: hideEl,
			configureTabs: configureTabs,
			showLoader: showLoader,
			hideLoader: hideLoader
		};

	});

}(window.MusicCenter));