import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const legacyConfig = {
	input: './js/bsi.js',
	plugins: [
		commonjs()
	],
	output: [
		{
			file: './build/bsi.js',
			format: 'iife',
			name: 'BSI'
		},
		{
			file: './build/bsi.min.js',
			format: 'iife',
			name: 'BSI',
			plugins: [uglify()]
		}
	]
};

export default legacyConfig;
