var ready;
var d2lComponentsLoaded = false;
var webComponentsReady = false;

function check() {
	if (d2lComponentsLoaded && webComponentsReady) {
		ready();
	}
}

function dcl() {
	window.removeEventListener('DOMContentLoaded', dcl);
	webComponentsReady = true;
	check();
}

function wcr() {
	window.removeEventListener('WebComponentsReady', wcr);
	webComponentsReady = true;
	check();
}

module.exports = {
	WebComponentsLoaded: function() {
		d2lComponentsLoaded = true;
		check();
	},
	WebComponentsReady: new Promise(function(resolve) {
		ready = resolve;
	}),
	init: function() {
		if (window.WebComponents && !window.WebComponents.ready) {
			window.addEventListener('WebComponentsReady', wcr);
		} else {
			if (document.readyState === 'interactive' || document.readyState === 'complete') {
				webComponentsReady = true;
				check();
			} else {
				window.addEventListener('DOMContentLoaded', dcl);
			}
		}
	},
	reset: function() {
		window.removeEventListener('WebComponentsReady', wcr);
		window.removeEventListener('DOMContentLoaded', dcl);
		d2lComponentsLoaded = false;
		webComponentsReady = false;
		this.WebComponentsReady = new Promise(function(resolve) {
			ready = resolve;
		});
	}
};
