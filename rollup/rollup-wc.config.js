import { createBasicConfig } from '@open-wc/building-rollup';

const componentFiles = [
	'./web-components/bsi-unbundled.js',
	'./node_modules/@brightspace-ui/core/components/button/button-icon.js',
	'./node_modules/d2l-navigation/d2l-navigation-band.js',
	'./web-components/d2l-opt-in-flyout-webcomponent.js',
	'./web-components/d2l-scroll-spy.js',
	'./web-components/d2l-simple-overlay.js',
	'./web-components/d2l-table.js',
	'./web-components/d2l-tabs.js',
];
const appFiles = [
	'./web-components/d2l-activity-alignments.js',
	'./web-components/d2l-activity-collections.js',
	'./web-components/d2l-activity-editor.js',
	'./web-components/d2l-activity-exemptions.js',
	'./web-components/d2l-awards-leaderboard-ui.js',
	'./web-components/d2l-cpd-report.js',
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
	'./web-components/d2l-consistent-evaluation.js',
	'./web-components/d2l-user-feedback.js',
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

export default config;
