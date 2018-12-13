import './polyfill/Array.prototype.includes.js';
import './polyfill/Array.prototype.findIndex.js';
import Lie from 'lie';
if (typeof Promise === 'undefined') {
	window.Promise = Lie;
}
