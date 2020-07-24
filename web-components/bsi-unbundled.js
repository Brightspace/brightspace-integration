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

// Toast alerts are not a separate import for 3 reasons:
// 1. Legacy toasts are created in JavaScript, so it would need to be loaded on every page anyway
// 2. MVC toasts happen via RpcPiggyback, which can render before new BSI assets are loaded
// 3. Quizzing is manually rendering a toast in JavaScript for offline/online notifications
import '@brightspace-ui/core/components/alert/alert-toast.js';

// TODO: these still need to be unbundled and loaded individually whenever they're used
// PageActionsMenu, ContextMenuPlaceholder, ButtonIcon, RubricBox, MenuFlyout, Quizzing (misc JS),
// legacy PageActions, legacy Grid actions, legacy ContextMenu placeholder, legacy Actions, Rubrics (misc JS)
import '@brightspace-ui/core/components/button/button-icon.js';
// ButtonSubtle, MenuFlyout, MenuFlyoutCustom, legacy Actions, legacy Grid actions,
// legacy ContextMenu placeholder, legacy Actions
import '@brightspace-ui/core/components/button/button-subtle.js';
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
// CollapsibleSection (MVC), Homepages
import 'd2l-polymer-behaviors/d2l-dom-expand-collapse.js';

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
