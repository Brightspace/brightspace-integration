import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
	plugins: [
		commonjs(),
		json(),
		resolve()
	],
	format: 'iife',
	moduleName: 'BSI'
};
