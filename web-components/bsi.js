import 'whatwg-fetch'; // Required for d2l-fetch + IE11
import './bsi-unbundled.js';

import '@brightspace-ui/core/components/alert/alert.js';
import '@brightspace-ui/core/components/backdrop/backdrop.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/button/floating-buttons.js';
import '@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js';
import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '@brightspace-ui/core/components/dropdown/dropdown-context-menu.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui/core/components/link/link.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui/core/components/menu/menu-item-checkbox.js';
import '@brightspace-ui/core/components/menu/menu-item-link.js';
import '@brightspace-ui/core/components/menu/menu-item-radio.js';
import '@brightspace-ui/core/components/menu/menu-item-separator.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/more-less/more-less.js';

import 'd2l-activities/components/d2l-subtitle/d2l-subtitle.js';
import '@d2l/switch/d2l-switch.js';
import 'd2l-button-group/d2l-action-button-group.js';
import 'd2l-button-group/d2l-button-group.js';
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
import 'd2l-save-status/d2l-save-status.js';
import 'd2l-simple-overlay/d2l-simple-overlay.js';
import 'd2l-tooltip/d2l-tooltip.js';
import 'd2l-users/components/d2l-profile-image.js';

window.d2lWCLoaded = true;
if (window.D2L.WebComponentsLoaded !== undefined) {
	window.D2L.WebComponentsLoaded();
}
