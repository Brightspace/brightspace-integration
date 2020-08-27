import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { d2lfetch } from 'd2l-fetch/src';
import { fetchAuth } from 'd2l-fetch-auth';
import { fetchDedupe } from 'd2l-fetch-dedupe';
import { fetchSimpleCache } from 'd2l-fetch-simple-cache';
import { setCancelSyntheticClickEvents  } from '@polymer/polymer/lib/utils/settings.js';
import { announce } from '@brightspace-ui/core/helpers/announce';
import { registerGestureSwipe } from '@brightspace-ui/core/helpers/gestures.js';
import { clearDismissible, setDismissible } from '@brightspace-ui/core/helpers/dismissible';

// ActionButtonMenu (legacy), MediaPlayer
import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
// Navbar, Flyout (MVC), LayoutBuilder
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
// ContextMenu (MVC), PageActions, EditNavbar, NavbarItem, ContextMenu (legacy), ActionButtonMenu (legacy)
// ButtonMenu (MVC), MediaPlayer
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
// EditNavbar, Homepages
import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
// ContextMenuPlaceholder, PageActionsMenu, Navigation, MenuFlyout, MenuFlyoutCustom, ButtonMenu,
// ContextMenu placeholder (legacy), LayoutBuilder
import '@brightspace-ui/core/components/dropdown/dropdown.js';
// MenuFlyout, Divider, TreeBrowserItemIcon, Icon, CollapsibleSection, Navigation (misc), RubricLink
// FeedbackAttachment, ButtonMenu, IteratorButton, RubricBox, ImageLink, PersonalMenuHandle, LabyoutBuilder
// Competencies (misc JS), Image (legacy), Grades (misc JS), Placeholder (legacy), PartialRendering,
// Custom selector (legacy)
import '@brightspace-ui/core/components/icons/icon.js';
// MenuItemCheckbox
import '@brightspace-ui/core/components/menu/menu-item-checkbox.js';
// EditNavbar, NavbarItem, MenuItemLink, PageActionsMenuItem, HomepageManageMenu, ContextMenu
import '@brightspace-ui/core/components/menu/menu-item-link.js';
// MenuItemRadio
import '@brightspace-ui/core/components/menu/menu-item-radio.js';
// ConextMenu.Separator, MenuItemSeparator, MobileLinksArea, contextMenu (legacy)
import '@brightspace-ui/core/components/menu/menu-item-separator.js';
// EditNavbar, MobileLinksArea, PageActionsMenuItem, Menu (MVC), HomepageManageMenu, ContextMenu,
// MediaPlayer, contextMenu (legacy)
import '@brightspace-ui/core/components/menu/menu-item.js';
// EditNavbar, MobileLinksArea, HomepageManageMenu, PageActionsMenu, Menu (MVC), ContextMenu (MVC),
// MediaPlayer, contextMenu (legacy), ActionButtons (legacy)
import '@brightspace-ui/core/components/menu/menu.js';

window.D2L = window.D2L || {};

window.D2L.Intl = {
	FormatNumber: formatNumber,
	FormatTime: formatTime,
	ParseNumber: parseNumber,
	ParseTime: parseTime
};

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
		const telemetry = await import('d2l-telemetry-browser-client');
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

window.D2L.Logging.CreateClient = function() {
	const batchSize = 500;
	const batchTime = 5000;
	const client = {
		Log: function(messages) {
			clearTimeout(this._batchTimeout);
			this._loggerPromise = this._loggerPromise || D2L.Logging.GetLogger(false);
			this._messages = [...this._messages, ...messages];
			while (this._messages.length >= batchSize) {
				const batch = this._messages.slice(0, batchSize);
				this._logWithFetch(batch);
			}
			if (this._messages.length > 0) {
				this._batchTimeout = setTimeout(() => {
					this._logWithFetch(this._messages);
					this._messages = [];
				}, batchTime);
			}
		},
		_logWithFetch: async function(messages) {
			const options = {
				method: 'POST',
				mode: 'cors',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(messages)
			};
			let logger = await this._loggerPromise;
			const resp = await window.fetch(logger.Endpoint, options);
			if (resp.status === 410) {
				this._loggerPromise = D2L.Logging.GetLogger(true);
				logger = await this._loggerPromise;
				options.mode = 'no-cors';
				window.fetch(logger.Endpoint, options);
			}
		},
		_logWithBeacon() {
			clearTimeout(this._batchTimeout);
			this._loggerPromise && this._loggerPromise.then(logger => {
				if (this._messages.length > 0) {
					var data = JSON.stringify(this._messages);
					navigator.sendBeacon(logger.Endpoint, data);
				}
			});
		},
		_messages: []
	};
	window.addEventListener('unload', () => client._logWithBeacon());
	return client;
};
window.D2L.Logging._ready();

/*
 * DE35087 - This was added by Polymer to handle ghost clicks in mobile browsers, but it has negative effects when using VoiceOver on iOS.
 * Events were being incorrectly canceled, mostly affecting selecting radio buttons but other user actions as well.
 * This line turns off this functionality.  See https://github.com/Polymer/polymer/issues/5289 for more info.
 */
setCancelSyntheticClickEvents(false);

window.D2L.Announce = announce;

window.D2L.Gestures = window.D2L.Gestures || {};
window.D2L.Gestures.Swipe = {register: registerGestureSwipe};

window.D2L.Dismissible = {
	Clear: function(id) {
		clearDismissible(id);
	},
	Set: function(cb) {
		return setDismissible(cb);
	}
};
