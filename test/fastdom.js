'use strict';

const expect = require('chai').expect,
	sinon = require('sinon'),
	d2lFastDom = require('../js/d2l-fastdom.js');

require('chai')
	.use(require('sinon-chai'))
	.should();

describe('d2l-fastdom', () => {

	var fastdomMock;

	beforeEach(() => {
		global.window = {
			addEventListener: sinon.spy(),
			fastdom: undefined,
			removeEventListener: sinon.spy()
		};
		fastdomMock = {
			clear: sinon.spy(),
			measure: sinon.stub(),
			mutate: sinon.stub()
		};
	});

	function triggerWebComponentReady() {
		var wcrCb = global.window.addEventListener.getCall(0).args[1];
		wcrCb();
	}

	afterEach(() => {
		d2lFastDom.__reset();
	});

	describe('clear', () => {

		it('should call directly into fastdom if loaded', () => {
			global.window['fastdom'] = fastdomMock;
			d2lFastDom.clear('1234');
			fastdomMock.clear.should.have.been.calledWith('1234');
		});

		it('should not call fastdom if cleared before loaded', () => {
			var id = d2lFastDom.mutate();
			global.window['fastdom'] = fastdomMock;
			d2lFastDom.clear(id);
			fastdomMock.clear.should.not.have.been.called;
		});

		it('should not call fastdom if cleared twice before loaded', () => {
			var id = d2lFastDom.mutate();
			global.window['fastdom'] = fastdomMock;
			d2lFastDom.clear(id);
			d2lFastDom.clear(id);
			fastdomMock.clear.should.not.have.been.called;
		});

		it('should call into fastdom if loaded after', () => {
			var id = d2lFastDom.measure();
			global.window['fastdom'] = fastdomMock;
			d2lFastDom.__getIdMap()[id].id = 'newId';
			d2lFastDom.clear(id);
			fastdomMock.clear.should.have.been.calledWith('newId');
		});

	});

	['measure', 'mutate'].forEach((method) => {
		describe(`method ${method}`, () => {

			it('should call directly into fastdom if loaded', () => {
				var cb = sinon.spy();
				fastdomMock[method].returns('5678');
				global.window['fastdom'] = fastdomMock;
				var id = d2lFastDom[method](cb);
				fastdomMock[method].should.have.been.calledWith(cb);
				expect(id).to.equal('5678');
			});

			it('should create a "pending" map entry when fastdom not loaded', () => {
				var id = d2lFastDom[method]();
				expect(d2lFastDom.__getIdMap()[id].id).to.equal('pending');
			});

			it('should add an event listener for "WebComponentsReady" when fastdom not loaded', () => {
				d2lFastDom[method]();
				global.window.addEventListener.should.have.been.called;
			});

			it('should call into fastdom after WCR event', () => {
				var cb = sinon.spy();
				d2lFastDom[method](cb);
				global.window['fastdom'] = fastdomMock;
				triggerWebComponentReady();
				fastdomMock[method].should.have.been.calledWith(cb);
			});

			it('should throw if fastdom is not available during and after WCR', () => {
				var expectedError = `Cannot read property '${method}' of undefined`;
				d2lFastDom[method]();
				expect(() => {
					triggerWebComponentReady();
				}).to.throw(expectedError);
				expect(() => {
					d2lFastDom[method]();
				}).to.throw(expectedError);
			});

			it('should replace "pending" map entry with fastdom value after WCR', () => {
				fastdomMock[method].returns('1234');
				var id = d2lFastDom[method]();
				global.window['fastdom'] = fastdomMock;
				triggerWebComponentReady();
				expect(d2lFastDom.__getIdMap()[id].id).to.equal('1234');
			});

			it('should remove WCR event listener', () => {
				d2lFastDom[method]();
				global.window['fastdom'] = fastdomMock;
				triggerWebComponentReady();
				global.window.removeEventListener.should.have.been.called.once;
			});

			it('should call into fastdom for each item in the queue', () => {
				var cb1 = sinon.spy(),
					cb2 = sinon.spy();
				d2lFastDom[method](cb1);
				d2lFastDom[method](cb2);
				global.window['fastdom'] = fastdomMock;
				triggerWebComponentReady();
				fastdomMock[method].should.have.been.calledWith(cb1);
				fastdomMock[method].should.have.been.calledWith(cb2);
			});

		});

	});

});
