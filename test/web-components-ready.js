'use strict';

const expect = require('chai').expect,
	sinon = require('sinon'),
	wcr = require('../js/d2l-web-components-ready.js');

require('chai')
	.use(require('sinon-chai'))
	.should();

describe('d2l-web-components-ready', () => {

	beforeEach(() => {
		global.document = {
			readyState: 'complete'
		};
		global.window = {
			addEventListener: sinon.spy(),
			removeEventListener: sinon.spy()
		};
	});

	afterEach(() => {
		wcr.reset();
	});

	function dispatchEventListener() {
		var cb = global.window.addEventListener.getCall(0).args[1];
		cb();
	}

	[undefined, null, 0, 'asdf', [1, 2, 3]].forEach((cb) => {
		it(`should not explode on non-function (${cb}) callback`, (done) => {
			wcr.WebComponentsReady.then(cb);
			wcr.WebComponentsReady.then(done);
			wcr.init();
			wcr.WebComponentsLoaded();
		});
	});

	it('should not execute if no WebComponentsReady', (done) => {
		wcr.WebComponentsReady.then(() => {
			done(new Error('should not be called'));
		});
		wcr.WebComponentsLoaded();
		done();
	});

	it('should not execute if no WebComponentsLoaded', (done) => {
		wcr.WebComponentsReady.then(() => {
			done(new Error('should not be called'));
		});
		wcr.init();
		done();
	});

	it('should execute after WebComponentsReady and WebComponentsLoaded', (done) => {
		wcr.WebComponentsReady.then(done);
		wcr.init();
		wcr.WebComponentsLoaded();
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
		wcr.init();
		wcr.WebComponentsReady.then(() => {
			count++;
			check();
		});
		wcr.WebComponentsLoaded();
		wcr.WebComponentsReady.then(() => {
			count++;
			check();
		});
	});

	describe('Polyfill not present', () => {

		describe('loading readyState', () => {

			beforeEach(() => {
				global.document.readyState = 'dunno';
			});

			it('should add listener for "DOMContentLoaded" when in other readyState', () => {
				wcr.init();
				global.window.addEventListener
					.should.have.been.calledWith('DOMContentLoaded');
			});

			it('should remove "DOMContentLoaded" listener', () => {
				wcr.init();
				dispatchEventListener();
				global.window.removeEventListener
					.should.have.been.calledWith('DOMContentLoaded');
			});

			it('should execute callbacks when "DOMContentLoaded" fires', (done) => {
				wcr.WebComponentsReady.then(done);
				wcr.init();
				wcr.WebComponentsLoaded();
				dispatchEventListener();
			});

			it('should execute callbacks in order', (done) => {
				let count = 0;
				function check() {
					if (count === 2) done();
				}
				wcr.WebComponentsReady.then(() => {
					count++;
					check();
				});
				wcr.init();
				wcr.WebComponentsLoaded();
				wcr.WebComponentsReady.then(() => {
					count++;
					check();
				});
				dispatchEventListener();
			});

		});

		describe('finished readyState', () => {

			['interactive', 'complete'].forEach((readyState) => {
				it(`should execute callback immediately when in "${readyState}" readyState`, (done) => {
					let count = 0;
					global.document.readyState = readyState;
					wcr.WebComponentsReady.then(() => {
						count++;
						expect(count).to.equal(1);
					});
					wcr.init();
					wcr.WebComponentsLoaded();
					wcr.WebComponentsReady.then(() => {
						count++;
						expect(count).to.equal(2);
						done();
					});
				});
			});

		});

	});

	describe('Polyfill present', () => {

		beforeEach(() => {
			global.window.WebComponents = {};
		});

		it('should not call callback initially', (done) => {
			wcr.WebComponentsReady.then(() => {
				done(new Error('should not be called'));
			});
			wcr.init();
			wcr.WebComponentsLoaded();
			done();
		});

		it('should add listener for "WebComponentsReady"', () => {
			wcr.init();
			global.window.addEventListener
				.should.have.been.calledWith('WebComponentsReady');
		});

		it('should remove "WebComponentsReady" listener', () => {
			wcr.init();
			dispatchEventListener();
			global.window.removeEventListener
				.should.have.been.calledWith('WebComponentsReady');
		});

		it('should execute callbacks when "WebComponentsReady" fires', (done) => {
			wcr.WebComponentsReady.then(done);
			wcr.init();
			wcr.WebComponentsLoaded();
			dispatchEventListener();
		});

		it('should execute callback immediately if "WebComponentsReady" already fired', (done) => {
			global.window.WebComponents.ready = true;
			global.document.readyState = 'interactive';
			wcr.WebComponentsReady.then(done);
			wcr.init();
			wcr.WebComponentsLoaded();
		});

	});

});
