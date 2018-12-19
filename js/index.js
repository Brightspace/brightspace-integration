import './polyfills.js';

window.D2L = window.D2L || {};

import webComponentsReady from './d2l-web-components-ready.js';
webComponentsReady.init();
window.D2L.WebComponentsLoaded = webComponentsReady.WebComponentsLoaded;
window.D2L.WebComponentsReady = webComponentsReady.WebComponentsReady;
if (window.D2L._webComponentsLoaded) {
	webComponentsReady.WebComponentsLoaded();
}

import FastDom from './d2l-fastdom.js';
window.D2L.FastDom = FastDom;

import './timing-debug.js';

import '../node_modules/jquery-vui-change-tracking/changeTracker.js';
import '../node_modules/jquery-vui-change-tracking/changeTracking.js';
