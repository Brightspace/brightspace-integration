import { expect } from 'chai';
import Serge from '../oslo/Serge.js';
import { ForbiddenCharacters } from '../oslo/Util.js';

describe('Serge parsing', () => {

	const serge = new Serge('/root', 'test', '/root/test', {
		name: 'test',
		source_dir: 'src',
		output_file_path: 'out'
	});

	describe('js', () => {

		const termNames = ['txtTerm\\u0020One', 'txtTermTwo'];

		it('parses valid js', () => {
			const js = `
				import something from 'something-else';
				
				// comment to be noisy
				
				const someConstant = 42;
				
				export default {
					'txtTerm One'  :"Value \\"'\\''\\" 1"  ,    // txtTermOne description
					txtTermTwo  :  '"\\'\\"Value: 2\\":,,\\'"'//txtTermTwo description
				};
			`;

			serge._parserPlugin = 'parse_js';
			const collection = serge._parse(js);

			expect(collection.name).to.equal('test\\test');

			for (const object of collection.objects) {

				expect(object.name).to.be.oneOf(termNames);

				switch (object.name) {

					case 'txtTerm\\u0020One':
						expect(object.defaultValue).to.equal('Value "\'\'\'" 1');
						expect(object.description).to.equal('txtTermOne description');
						break;

					case 'txtTermTwo':
						expect(object.defaultValue).to.equal('"\'"Value: 2":,,\'"');
						expect(object.description).to.equal('txtTermTwo description');
						break;

					default:
						expect.fail('Unexpected term name in collections');
				}
			}
		});

		it('throws an error if a forbidden character is found in a term name', () => {

			for (const char of ForbiddenCharacters) {
				const js = `
					import something from 'something-else';
				
					// comment to be noisy
				
					const someConstant = 42;
				
					export default {
						'termWith${char}InIt' : "Value"
					};
				`;

				serge._parserPlugin = 'parse_js';
				expect(
					() => serge._parse(js),
					`Expected OSLO error when parsing character '${char}'`
				).to.throw('OSLO error: Forbidden characters used in LangObject name');
			}
		});
	});
});
