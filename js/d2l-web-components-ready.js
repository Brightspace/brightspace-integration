var ready;
var d2lComponentsLoaded = false;
var webComponentsReady = false;
var fontsLoaded = false;

function check() {
	if (d2lComponentsLoaded && webComponentsReady && fontsLoaded) {
		ready();
	}
}

export default {
	FontsLoaded: function() {
		fontsLoaded = true;
		check();
	},
	WebComponentsLoaded: function() {
		d2lComponentsLoaded = true;
		check();
	},
	WCRDispatched: function() {
		webComponentsReady = true;
		check();
	},
	WebComponentsReady: new Promise(function(resolve) {
		ready = resolve;
	}),
	reset: function() {
		d2lComponentsLoaded = false;
		fontsLoaded = false;
		webComponentsReady = false;
		this.WebComponentsReady = new Promise(function(resolve) {
			ready = resolve;
		});
	}
};
