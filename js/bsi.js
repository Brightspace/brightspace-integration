import './polyfills.js';
import webComponentsReady from './d2l-web-components-ready.js';
import FastDom from './d2l-fastdom.js';
import FastDomPromised from '../node_modules/fastdom/extensions/fastdom-promised.js';
import './timing-debug.js';
import './performance-timings.js';
import '../node_modules/jquery-vui-change-tracking/changeTracker.js';
import '../node_modules/jquery-vui-change-tracking/changeTracking.js';

window.D2L = window.D2L || {};

window.D2L.WebComponentsLoaded = webComponentsReady.WebComponentsLoaded;
window.D2L.WCRDispatched = webComponentsReady.WCRDispatched;
window.D2L.WebComponentsReady = webComponentsReady.WebComponentsReady;
if (window.d2lWCLoaded) {
	webComponentsReady.WebComponentsLoaded();
}
if (window.d2lWCRDispatched) {
	webComponentsReady.WCRDispatched();
}

window.D2L.FastDom = FastDom;
window.D2L.fastdom = FastDomPromised;
window.D2L.fastdom.fastdom = FastDom;
window.D2L.fastdom.initialize();
