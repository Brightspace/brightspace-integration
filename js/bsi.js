import webComponentsReady from './d2l-web-components-ready.js';
import './timing-debug.js';
import './performance-timings.js';

window.D2L = window.D2L || {};

window.D2L.FontsLoaded = webComponentsReady.FontsLoaded;
window.D2L.WebComponentsLoaded = webComponentsReady.WebComponentsLoaded;
window.D2L.WCRDispatched = webComponentsReady.WCRDispatched;
window.D2L.WebComponentsReady = webComponentsReady.WebComponentsReady;
if (window.d2lWCLoaded) {
	webComponentsReady.WebComponentsLoaded();
}
if (window.d2lWCRDispatched) {
	webComponentsReady.WCRDispatched();
}
if (window.d2lFontsLoaded) {
	webComponentsReady.FontsLoaded();
} else {
	setTimeout(function() {
		webComponentsReady.FontsLoaded();
	}, 2000);
}
