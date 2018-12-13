import './polyfills.js';

window.D2L = window.D2L || {};

import webComponentsReady from './d2l-web-components-ready.js';
webComponentsReady.init();
window.D2L.WebComponentsReady = webComponentsReady.WebComponentsReady;

import FastDom from './d2l-fastdom.js';
window.D2L.FastDom = FastDom;

import './timing-debug.js';

import '../bower_components/jquery-vui-change-tracking/changeTracker.js';
import '../bower_components/jquery-vui-change-tracking/changeTracking.js';
import '../bower_components/jquery-vui-collapsible-section/collapsibleSection.js';
