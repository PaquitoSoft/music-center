(function() {
	'use strict';

	var MAIN_NAMESPACE = 'MusicCenter';

	var mainContext = {};
	
	var components = {};

	function registerComponent(componentName, dependencies, factory) {
		if (!components[componentName]) {
			if (typeof dependencies === 'function') {
				factory = dependencies;
				dependencies = null;
			}
			components[componentName] = {
				factory: factory,
				dependencies: dependencies,
				instance: null
			};
		} else {
			console.warn('You are trying to register an already registered component: ', componentName);
		}
	}

	function startComponent(name, context, config) {
		console.debug('Initializing component: ', name);
		var component = components[name],
			componentDependencies = [],
			_config = config || {},
			result,
			dep, prop;

		// Check if component is registered
		if (component) {

			// Check if component is already started
			if (!component.instance) {

				try {

					// Detect component's dependencies
					if (component.dependencies) {
						component.dependencies.forEach(function(depName) {

							// Check if dependency is available
							dep = components[depName];
							if (dep) {
								if (!dep.instance) {

									// Initialize dependency
									componentDependencies.push(startComponent(depName, context));

								} else {
									componentDependencies.push(dep.instance);
									console.debug("Dependency already initialized: ", depName);
								}
							} else {
								// TODO Should I throw an error here?
								console.warn('You were trying to initialize component "', name,
									'" with an unknown dependency: ', depName);
							}

						});
					}

					// Initialize component
					result = component.instance = component.factory.apply(null, [context].concat(componentDependencies));
					
					// Start component
					if (typeof component.instance.init === 'function') {
						component.instance.init.call(context, _config.mainEl);
						console.debug('Component started: ', name);
					}

				} catch (err) {
					console.error('There was an error starting the component "', name, '":', err.message, '\n', err.stack);
				}

			} else {
				// TODO How to allow for starting component again? Stop and start? Is this actually needed?
				console.warn("You are trying to start an already started component: ", name);
			}

		} else {
			console.warn('You are trying to start an unregistered component: ', name);
		}

		return result;
	}

	function stopComponent(name) {
		var component = components[name];

		if (component) {
			if (component.instance) {
				if (typeof component.instance.stop === 'function') {
					component.instance.stop.call();
				}
				delete component.instance;
			} else {
				console.warn('You are trying to stop a non started component: ', name);
			}
		} else {
			console.warn('You are trying to stop an unknown component: ', name);
		}
	}

	function init(appContext) {
		console.debug('Time until parser gets to core initialization from top document:', Date.now() - window._pageInitialTime);
		console.debug('Initializing core...');
		var t1 = Date.now();

		var domComponents = document.querySelectorAll('*[data-comp]'),
			index, len;
		mainContext = appContext;

		for (index = 0, len = domComponents.length; index < len; index++) {
			startComponent(domComponents[index].getAttribute('data-comp'), mainContext, { mainEl: domComponents[index] });
		}

		console.debug('Time consumed to initialize the core: ', Date.now() - t1, ' (ms)');
		console.debug('Time consumed from document top until core is initialized:', Date.now() - window._pageInitialTime);
	}

	// Public API
	window[MAIN_NAMESPACE] = {
		register: registerComponent,
		init: init,
		startComponent: startComponent,
		stopComponent: stopComponent
	};

}());