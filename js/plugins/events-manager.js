(function(core) {
	'use strict';

	core.register('plugins/events-manager', function EventsManagerPlugin(mainContext) {
		var eventsMap = {};

		function listenEvent(eventName, listener) {
			var listeners = eventsMap[eventName] || [];
			listeners.push(listener);
			eventsMap[eventName] = listeners;
		}

		function stopListening(eventName, listener) {
			var listeners = eventsMap[eventName],
				listenerIndex = -1,
				result = false,
				loopIndex, len;

			if (listeners) {
				for (loopIndex = 0, len = listeners.length; i < len; i++) {
					if (listeners[i] === listener) {
						listenerIndex = loopIndex;
						break;
					}
				}

				if (listenerIndex) {
					result = listeners.splice(listenerIndex, 1).length > 0;
					eventsMap[eventName] = listeners;
				}
			}

			return result;
		}

		function triggerEvent(eventName, context) {
			var listeners = eventsMap[eventName],
				index, len;

			if (listeners) {
				listeners.forEach(function(listener) {
					try {
						listener(context);
					} catch (err) {
						console.warn('There was an error executing a event listener. Event name: ',
							eventName, ". Context: ", context, ". Listener name: ", listener.name);
						console.error(err.stack);
					}
				});
			}
		}

		// Public API
		return {
			listen: listenEvent,
			stopListening: stopListening,
			trigger: triggerEvent
		};
	});

}(window.MusicCenter));