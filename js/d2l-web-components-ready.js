var ready;

function dcl() {
	window.removeEventListener('DOMContentLoaded', dcl);
	ready();
}

function wcr() {
	window.removeEventListener('WebComponentsReady', wcr);
	ready();
}

module.exports = {
	WebComponentsReady: new Promise(function(resolve) {
		ready = resolve;
	}),
	init: function() {
		if (window.WebComponents && !window.WebComponents.ready) {
			window.addEventListener('WebComponentsReady', wcr);
		} else {
			if (document.readyState === 'interactive' || document.readyState === 'complete') {
				ready();
			} else {
				window.addEventListener('DOMContentLoaded', dcl);
			}
		}
	},
	reset: function() {
		window.removeEventListener('WebComponentsReady', wcr);
		window.removeEventListener('DOMContentLoaded', dcl);
		this.WebComponentsReady = new Promise(function(resolve) {
			ready = resolve;
		});
	}
};
