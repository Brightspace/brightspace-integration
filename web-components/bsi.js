import 'whatwg-fetch'; // Required for d2l-fetch + IE11

import 'fastdom';

import d2lIntl from 'd2l-intl';
window.d2lIntl = d2lIntl;

import { d2lfetch } from '../node_modules/d2l-fetch/src/index.js';
import { fetchAuth } from 'd2l-fetch-auth';
import { fetchDedupe } from 'd2l-fetch-dedupe';
import { fetchSimpleCache } from 'd2l-fetch-simple-cache';

d2lfetch.use({
	name: 'auth',
	fn: fetchAuth,
	options: {
		enableTokenCache: true
	}
});
d2lfetch.use({name: 'dedupe', fn: fetchDedupe});
d2lfetch.use({name: 'simple-cache', fn: fetchSimpleCache});
window.d2lfetch = d2lfetch;

import '@polymer/iron-icon/iron-icon.js';
import 'd2l-activities/components/d2l-quick-eval/d2l-quick-eval.js';
import 'd2l-alert/d2l-alert-toast.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-button-group/d2l-action-button-group.js';
import 'd2l-button-group/d2l-button-group.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-button/d2l-button-subtle.js';
import 'd2l-button/d2l-floating-buttons.js';
import 'd2l-dropdown/d2l-dropdown-button-subtle.js';
import 'd2l-dropdown/d2l-dropdown-button.js';
import 'd2l-dropdown/d2l-dropdown-content.js';
import 'd2l-dropdown/d2l-dropdown-context-menu.js';
import 'd2l-dropdown/d2l-dropdown-menu.js';
import 'd2l-dropdown/d2l-dropdown-more.js';
import 'd2l-dropdown/d2l-dropdown.js';
import 'd2l-icons/d2l-icons.js';
import 'd2l-inputs/d2l-input-search.js';
import 'd2l-link/d2l-link.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-menu/d2l-menu-item-link.js';
import 'd2l-menu/d2l-menu.js';
import 'd2l-navigation/d2l-navigation-band.js';
import 'd2l-navigation/d2l-navigation-button-close.js';
import 'd2l-navigation/d2l-navigation-button-notification-icon.js';
import 'd2l-navigation/d2l-navigation-button.js';
import 'd2l-navigation/d2l-navigation-immersive.js';
import 'd2l-navigation/d2l-navigation-link-back.js';
import 'd2l-navigation/d2l-navigation-link-image.js';
import 'd2l-navigation/d2l-navigation-link.js';
import 'd2l-navigation/d2l-navigation-main-footer.js';
import 'd2l-navigation/d2l-navigation-main-header.js';
import 'd2l-navigation/d2l-navigation-separator.js';
import 'd2l-navigation/d2l-navigation.js';
import 'd2l-organizations/components/d2l-organization-consortium/d2l-organization-consortium-tabs.js';
import 'd2l-polymer-behaviors/d2l-dom-expand-collapse.js';
import 'd2l-polymer-behaviors/d2l-gestures-swipe.js';
import 'd2l-save-status/d2l-save-status.js';
import 'd2l-simple-overlay/d2l-simple-overlay.js';
import 'd2l-users/components/d2l-profile-image.js';

import './navigation-icons.js';
window.d2lWCLoaded = true;
if (window.D2L.WebComponentsLoaded !== undefined) {
	window.D2L.WebComponentsLoaded();
}
