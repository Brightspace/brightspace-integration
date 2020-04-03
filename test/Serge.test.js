import { expect } from 'chai';
import Serge from '../oslo/Serge.js';

describe('Serge parsing', () => {

	const serge = new Serge('/root', 'test', '/root/test', {
		name: 'test',
		source_dir: 'src',
		output_file_path: 'out'
	});

	describe('js', () => {

		const js = `
import something from 'something-else';

// comment to be noisy

const someConstant = 42;

export default {

	"txtTerm.One": 'Value \\'"\\""\\' 1', // txtTermOne description
	  'txtTerm Two'  :"Value \\"'\\''\\" 2"  ,    // txtTermTwo description
txtTermThree  :  '"\\'\\"Value: 3\\":,,\\'"'//txtTermThree description
};
`;

		const termNames = ['txtTerm\\u002EOne', 'txtTerm\\u0020Two', 'txtTermThree'];

		it('parses complicated js', () => {

			const collection = serge._parseJs(js);

			expect(collection.name).to.equal('test\\test');

			for (const object of collection.objects) {

				expect(object.name).to.be.oneOf(termNames);

				switch (object.name) {

					case 'txtTerm\\u002EOne':
						expect(object.defaultValue).to.equal('Value \'"""\' 1');
						expect(object.description).to.equal('txtTermOne description');
						break;

					case 'txtTerm\\u0020Two':
						expect(object.defaultValue).to.equal('Value "\'\'\'" 2');
						expect(object.description).to.equal('txtTermTwo description');
						break;

					case 'txtTermThree':
						expect(object.defaultValue).to.equal('"\'"Value: 3":,,\'"');
						expect(object.description).to.equal('txtTermThree description');
						break;
				}
			}
		});
	});
});
