import wcr from '../js/d2l-web-components-ready.js';
import { use } from 'chai';
import sinonChai from 'sinon-chai';

use(sinonChai).should();

describe('d2l-web-components-ready', () => {

	afterEach(() => {
		wcr.reset();
	});

	[undefined, null, 0, 'asdf', [1, 2, 3]].forEach((cb) => {
		it(`should not explode on non-function (${cb}) callback`, (done) => {
			wcr.WebComponentsReady.then(cb);
			wcr.WebComponentsReady.then(done);
			wcr.WebComponentsLoaded();
			wcr.WCRDispatched();
			wcr.FontsLoaded();
		});
	});

	it('should not execute if no WebComponentsReady', (done) => {
		wcr.WebComponentsReady.then(() => {
			done(new Error('should not be called'));
		});
		wcr.WebComponentsLoaded();
		wcr.FontsLoaded();
		done();
	});

	it('should not execute if no WebComponentsLoaded', (done) => {
		wcr.WebComponentsReady.then(() => {
			done(new Error('should not be called'));
		});
		wcr.WCRDispatched();
		wcr.FontsLoaded();
		done();
	});

	it('should not execute if no FontsLoaded', (done) => {
		wcr.WebComponentsReady.then(() => {
			done(new Error('should not be called'));
		});
		wcr.WebComponentsLoaded();
		wcr.WCRDispatched();
		done();
	});

	it('should execute after WebComponentsReady, WebComponentsLoaded and FontsLoaded', (done) => {
		wcr.WebComponentsReady.then(done);
		wcr.WCRDispatched();
		wcr.WebComponentsLoaded();
		wcr.FontsLoaded();
	});

	it('should execute all callbacks', (done) => {
		let count = 0;
		function check() {
			if (count === 3) done();
		}
		wcr.WebComponentsReady.then(() => {
			count++;
			check();
		});
		wcr.WCRDispatched();
		wcr.WebComponentsReady.then(() => {
			count++;
			check();
		});
		wcr.WebComponentsLoaded();
		wcr.WebComponentsReady.then(() => {
			count++;
			check();
		});
		wcr.FontsLoaded();
	});

});
