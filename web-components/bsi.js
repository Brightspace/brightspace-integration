import 'whatwg-fetch'; // Required for d2l-fetch + IE11

import 'fastdom';

import {formatNumber, parseNumber} from '@brightspace-ui/intl/lib/number.js';
import {formatTime, parseTime} from '@brightspace-ui/intl/lib/dateTime.js';
window.D2L.Intl = {
	FormatNumber: formatNumber,
	FormatTime: formatTime,
	ParseNumber: parseNumber,
	ParseTime: parseTime
};

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

window.D2L.Telemetry = {
	Load: async function() {
		const telemetry = await import('../node_modules/d2l-telemetry-browser-client/src/index.js');
		return telemetry.default;
	},
	CreateClient: async function() {
		const telemetry = await D2L.Telemetry.Load();
		const endpoint = document.documentElement.getAttribute('data-telemetry-endpoint');
		if (endpoint === null) {
			throw new Error('Unable to create telemetry client, missing endpoint.');
		}
		const client = new telemetry.Client({endpoint: endpoint});
		return client;
	}
};

import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/button/floating-buttons.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/more-less/more-less.js';
import 'd2l-activities/components/d2l-subtitle/d2l-subtitle.js';
import '@d2l/switch/d2l-switch.js';
import 'd2l-alert/d2l-alert-toast.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-button-group/d2l-action-button-group.js';
import 'd2l-button-group/d2l-button-group.js';
import 'd2l-dropdown/d2l-dropdown-button-subtle.js';
import 'd2l-dropdown/d2l-dropdown-button.js';
import 'd2l-dropdown/d2l-dropdown-content.js';
import 'd2l-dropdown/d2l-dropdown-context-menu.js';
import 'd2l-dropdown/d2l-dropdown-menu.js';
import 'd2l-dropdown/d2l-dropdown-more.js';
import 'd2l-dropdown/d2l-dropdown.js';
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
import 'd2l-navigation/components/d2l-navigation-iterator/d2l-navigation-iterator.js';
import 'd2l-navigation/components/d2l-navigation-iterator/d2l-navigation-link-iterator.js';
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

/*
 * DE35087 - This was added by Polymer to handle ghost clicks in mobile browsers, but it has negative effects when using VoiceOver on iOS.
 * Events were being incorrectly canceled, mostly affecting selecting radio buttons but other user actions as well.
 * This line turns off this functionality.  See https://github.com/Polymer/polymer/issues/5289 for more info.
 */
import { setCancelSyntheticClickEvents  } from '@polymer/polymer/lib/utils/settings.js';
setCancelSyntheticClickEvents(false);

import {announce} from '../node_modules/@brightspace-ui/core/helpers/announce.js';
window.D2L.Announce = announce;

import {clearDismissible, setDismissible} from '../node_modules/@brightspace-ui/core/helpers/dismissible.js';
window.D2L.Dismissible = {
	Clear: function(id) {
		clearDismissible(id);
	},
	Set: function(cb) {
		return setDismissible(cb);
	}
};

window.d2lWCLoaded = true;
if (window.D2L.WebComponentsLoaded !== undefined) {
	window.D2L.WebComponentsLoaded();
}
