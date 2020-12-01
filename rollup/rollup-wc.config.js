import { createBasicConfig } from '@open-wc/building-rollup';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import merge from 'deepmerge';

const componentFiles = [
	'./web-components/bsi-unbundled.js',
	'./node_modules/@brightspace-ui/core/components/alert/alert.js',
	'./node_modules/@brightspace-ui/core/components/alert/alert-toast.js',
	'./node_modules/@brightspace-ui/core/components/backdrop/backdrop.js',
	'./node_modules/@brightspace-ui/core/components/breadcrumbs/breadcrumb.js',
	'./node_modules/@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js',
	'./node_modules/@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js',
	'./node_modules/@brightspace-ui/core/components/button/button.js',
	'./node_modules/@brightspace-ui/core/components/button/button-icon.js',
	'./node_modules/@brightspace-ui/core/components/button/button-subtle.js',
	'./node_modules/@brightspace-ui/core/components/button/floating-buttons.js',
	'./node_modules/@brightspace-ui/core/components/dialog/dialog-fullscreen.js',
	'./node_modules/@brightspace-ui/core/components/dropdown/dropdown.js',
	'./node_modules/@brightspace-ui/core/components/dropdown/dropdown-button.js',
	'./node_modules/@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js',
	'./node_modules/@brightspace-ui/core/components/dropdown/dropdown-content.js',
	'./node_modules/@brightspace-ui/core/components/dropdown/dropdown-context-menu.js',
	'./node_modules/@brightspace-ui/core/components/dropdown/dropdown-menu.js',
	'./node_modules/@brightspace-ui/core/components/dropdown/dropdown-more.js',
	'./node_modules/@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js',
	'./node_modules/@brightspace-ui/core/components/icons/icon.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-checkbox.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-date.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-date-range.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-date-time.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-date-time-range.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-number.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-search.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-text.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-time.js',
	'./node_modules/@brightspace-ui/core/components/inputs/input-time-range.js',
	'./node_modules/@brightspace-ui/core/components/loading-spinner/loading-spinner.js',
	'./node_modules/@brightspace-ui/core/components/menu/menu.js',
	'./node_modules/@brightspace-ui/core/components/menu/menu-item.js',
	'./node_modules/@brightspace-ui/core/components/menu/menu-item-checkbox.js',
	'./node_modules/@brightspace-ui/core/components/menu/menu-item-link.js',
	'./node_modules/@brightspace-ui/core/components/menu/menu-item-radio.js',
	'./node_modules/@brightspace-ui/core/components/menu/menu-item-separator.js',
	'./node_modules/@brightspace-ui/core/components/more-less/more-less.js',
	'./node_modules/@brightspace-ui/core/components/status-indicator/status-indicator.js',
	'./node_modules/@brightspace-ui/core/components/switch/switch.js',
	'./node_modules/@brightspace-ui/core/components/switch/switch-visibility.js',
	'./node_modules/@brightspace-ui/core/components/tooltip/tooltip.js',
	'./node_modules/@brightspace-ui/htmleditor/htmleditor.js',
	'./node_modules/@brightspace-ui-labs/media-player/media-player.js',
	'./node_modules/@brightspace-ui-labs/pagination/pagination.js',
	'./node_modules/d2l-activities/components/d2l-subtitle/d2l-subtitle.js',
	'./node_modules/d2l-button-group/d2l-button-group.js',
	'./node_modules/d2l-button-group/d2l-action-button-group.js',
	'./node_modules/d2l-inputs/d2l-input-textarea.js',
	'./node_modules/d2l-navigation/d2l-navigation-band.js',
	'./node_modules/d2l-navigation/d2l-navigation-button-notification-icon.js',
	'./node_modules/d2l-navigation/d2l-navigation-button.js',
	'./node_modules/d2l-navigation/d2l-navigation-immersive.js',
	'./node_modules/d2l-navigation/components/d2l-navigation-iterator/d2l-navigation-iterator.js',
	'./node_modules/d2l-navigation/d2l-navigation-link-back.js',
	'./node_modules/d2l-navigation/d2l-navigation-link-image.js',
	'./node_modules/d2l-navigation/d2l-navigation-link.js',
	'./node_modules/d2l-navigation/d2l-navigation-main-footer.js',
	'./node_modules/d2l-navigation/d2l-navigation-main-header.js',
	'./node_modules/d2l-navigation/d2l-navigation-separator.js',
	'./node_modules/d2l-navigation/d2l-navigation.js',
	'./node_modules/d2l-organizations/components/d2l-organization-consortium/d2l-organization-consortium-tabs.js',
	'./node_modules/d2l-save-status/d2l-save-status.js',
	'./node_modules/d2l-users/components/d2l-profile-image-base.js',
	'./node_modules/d2l-ads-scheduler/src/components/d2l-manage-schedules.js',
	'./node_modules/d2l-ads-scheduler/src/components/d2l-schedule-logs.js',
	'./node_modules/d2l-ads-scheduler/src/components/d2l-wizard-manager.js',
	'./web-components/d2l-opt-in-flyout-webcomponent.js',
	'./web-components/d2l-scroll-spy.js',
	'./web-components/d2l-simple-overlay.js',
	'./web-components/d2l-table.js',
	'./web-components/d2l-tabs.js',
	'./web-components/intl-messageformat-parser.js'
];
const appFiles = [
	'./node_modules/@brightspace-hmc/foundation-components/components/activity/editor/d2l-hc-activity-editor.js',
	'./node_modules/d2l-activities/components/d2l-activity-editor/d2l-activity-assignment-editor/d2l-activity-assignment-editor.js',
	'./node_modules/d2l-activities/components/d2l-activity-editor/d2l-activity-quiz-editor/d2l-activity-quiz-editor.js',
	'./node_modules/d2l-activities/components/d2l-work-to-do/d2l-work-to-do.js',
	'./node_modules/d2l-engagement-dashboard/engagement-dashboard.js',
	'./web-components/d2l-activity-alignments.js',
	'./web-components/d2l-activity-collections.js',
	'./web-components/d2l-activity-editor.js',
	'./web-components/d2l-activity-exemptions.js',
	'./web-components/d2l-awards-leaderboard-ui.js',
	'./web-components/d2l-cpd-report.js',
	'./web-components/d2l-discovery-app.js',
	'./web-components/d2l-enrollment-collection-widget.js',
	'./web-components/d2l-enrollment-summary-view.js',
	'./web-components/d2l-image-banner-overlay.js',
	'./web-components/d2l-my-courses.js',
	'./web-components/d2l-my-dashboards.js',
	'./web-components/d2l-sequence-viewer.js',
	'./web-components/d2l-rubric.js',
	'./web-components/d2l-rubric-editor.js',
	'./web-components/d2l-outcomes-level-of-achievements.js',
	'./web-components/d2l-outcomes-user-progress.js',
	'./web-components/d2l-program-outcomes-picker.js',
	'./web-components/d2l-quick-eval.js',
	'./web-components/d2l-content-store.js',
	'./node_modules/d2l-content-store-add-content/d2l-content-store-add-content.js',
	'./web-components/d2l-capture-central.js',
	'./web-components/d2l-consistent-evaluation.js',
	'./web-components/d2l-content-creation.js',
	'./web-components/d2l-user-feedback.js',
	'./node_modules/d2l-teacher-course-creation/src/components/d2l-teacher-course-creation.js',
	'./node_modules/d2l-teacher-course-creation/src/components/d2l-teacher-course-creation-admin.js',
	'./node_modules/d2l-outcomes-overall-achievement/src/mastery-view-table/mastery-view-table.js'
];
// NOTE: Ideally these should all be dynamically imported by apps.
//       Please don't add new entries to this list.
const staticFiles = [
	'node_modules/@d2l/d2l-attachment/locales/*.json',
	'node_modules/@d2l/d2l-attachment/icons/*.svg',
	'node_modules/d2l-activities/components/d2l-activity-collection-editor/lang/*.js',
	'node_modules/d2l-activities/components/d2l-activity-editor/**/lang/*.js',
	'node_modules/d2l-awards-leaderboard-ui/images/**',
	'node_modules/d2l-awards-leaderboard-ui/lang/*.json',
	'node_modules/d2l-rubric/editor/images/**',
	'node_modules/d2l-html-editor/skin-4.3.7/**',
	'node_modules/d2l-html-editor/langs/**',
	'node_modules/d2l-html-editor/d2l_lang_plugin/**',
	'node_modules/d2l-html-editor/**/*.css',
	'node_modules/d2l-cpd/locales/**.json'
];

const config = createBasicConfig({
	developmentMode: false, /* forces tree-shaking, minify ON */
	legacyBuild: true, /* required for IE11 and legacy-Edge support */
	outputDir: 'build/unbundled'
});
config.input = componentFiles.concat(appFiles);
config.output[0].entryFileNames = '[name].js';
config.output[0].chunkFileNames = '[name].js';
config.output[1].entryFileNames = 'nomodule-[name].js';
config.output[1].chunkFileNames = 'nomodule-[name].js';

export default merge(config, {
	plugins: [
		copy({
			targets: staticFiles.map((f) => {
				return {src: f, dest: 'build/unbundled/node_modules'};
			}),
			flatten: false
		}),
		replace({
			define: 'defineNoYouDont', /* prevents UMD time bomb as fastdom will try to call define() on UMD FRA pages */
			include: ['node_modules/fastdom/fastdom.js', 'node_modules/focus-visible/dist/focus-visible.js']
		})
	]
});
