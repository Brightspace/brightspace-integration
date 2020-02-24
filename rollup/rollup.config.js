import commonjs from '@rollup/plugin-commonjs';

const legacyConfig = {
	input: './js/bsi.js',
	plugins: [
		commonjs()
	],
	output: {
		dir: 'build',
		format: 'iife',
		name: 'BSI',
		sourcemap: true
	}
};

export default legacyConfig;
