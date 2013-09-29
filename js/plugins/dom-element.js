(function(core) {
	'use strict';

	core.register('plugins/dom-element', function(context) {

		function DOMElement(nativeEl) {
			this.el = nativeEl;
			this.customData = {};
		}

		DOMElement.prototype = {
			findById: function findById(id) {
				var result = (typeof this.el.getElementById === 'function') ? this.el.getElementById(id) : this.el.querySelector('#' + id);
				return (result) ? new DOMElement(result) : null;
			},
			findEl: function findEl(selector) {
				var result = this.el.querySelector(selector);
				return (result) ? new DOMElement(result) : null;
			},
			findEls: function findEls(selector, $context) {
				return Array.prototype.slice.call(this.el.querySelectorAll(selector))
						.map(function(el) {
							return new DOMElement(el);
					});
			},
			parent: function(parentCssClass) {
				var parentNode = this.el.parentNode,
					result = null,
					$parentEl;

				if (parentNode) {
					$parentEl = new DOMElement(parentNode);
					if (parentNode.className && parentNode.className.match(parentCssClass)) {
						result = $parentEl;
					} else {
						result = $parentEl.parent(parentCssClass);
					}
				}

				return result;
			},

			listen: function listenEvent(eventType, delegateElClass, handler) {
				var $targetEl;

				if (typeof delegateElClass === 'function') {
					handler = delegateElClass;
					delegateElClass = null;
				}

				if (!delegateElClass) {
					this.el.addEventListener(eventType, handler, false);
				} else {
					this.el.addEventListener(eventType, function(event) {
						var e = event || window.event,
							target = e.target || e.srcElement,
							$targetEl;
						
						if (target) {
							$targetEl = new DOMElement(target);
							if (target.className.match(delegateElClass) ||
								($targetEl = $targetEl.parent(delegateElClass)) ) {

								handler.call(null, e, $targetEl);
							}
						}
						
					}, false);
				}
				
				return this;
			},
			stopListening: function(eventHandler) {
				this.el.removeEventListener(eventHandler);
				return this;
			},
			click: function() {
				var e;
				if (this.el.click) {
					this.el.click();
				} else {
					e = document.createEvent('MouseEvents');
					e.initMouseEvent('click', true, true, window);
					this.el.dispatchEvent(e);
				}
				
			},

			content: function content(newContent) {
				if (typeof newContent !== 'undefined' && newContent !== null) {
					this.el.innerHTML = newContent;
					return this;
				}
				return this.el.innerHTML;
			},
			text: function(newText) {
				if (newText) {
					this.el.innerText = newText;
					return this;
				}
				return this.el.innerText;
			},

			setStyle: function(name, value) {
				if (typeof name === 'object') {
					Object.keys(name).forEach(function(styleName) {
						this.style[styleName] = name[styleName];
					}, this.el);
				} else {
					this.el.style[name] = (value.constructor === Number) ? value + 'px' : value;
				}
				return this;
			},
			addClass: function(className) {
				this.el.classList.add(className);
				return this;
			},
			removeClass: function(className) {
				this.el.classList.remove(className);
				return this;
			},
			toggleClass: function(className) {
				this.el.classList.toggle(className);
				return this;
			},
			hasClass: function(className) {
				return this.el.classList.contains(className);
			},
			size: function() {
				return {
					width: this.el.offsetWidth,
					height: this.el.offsetHeight
				};
			},

			data: function(key, value) {
				if (typeof value === 'undefined') {
					return this.customData[key];
				} else {
					this.customData[key] = value;
					return this;
				}
			},
			attr: function(key, value) {
				if (typeof value === 'undefined') {
					return this.el.getAttribute(key);
				}
				this.el.setAttribute(key, value);
			},
			value: function() {
				return this.el.value;
			}
		};

		// Public API
		return DOMElement;
	});

}(window.MusicCenter));