import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
	plugins: [
		resolve({
			browser: true
		}),
		commonjs(),
		json()
	],
	output: {
		format: 'iife',
		name: 'BSI',
		sourcemap: true
	}
};
