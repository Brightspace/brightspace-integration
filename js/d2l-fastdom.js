var index = 0;
var idMap = {};
var wcrFired = false;

function wcr() {

	wcrFired = true;

	for (var id in idMap) {
		var item = idMap[id];
		if (item.id === 'pending') {
			item.id = window['fastdom'][item.method](item.cb);
		}
	}

	window.removeEventListener('WebComponentsReady', wcr);

}

function helper(method, cb) {
	if (window['fastdom'] || wcrFired) {
		return window['fastdom'][method](cb);
	}
	index++;
	var fastDomId = 'd2l_fastdom_' + index;
	idMap[fastDomId] = {method: method, id: 'pending', cb: cb};
	window.addEventListener('WebComponentsReady', wcr);
	return fastDomId;
}

module.exports = {
	__getIndex: function() { return index; },
	__getIdMap: function() { return idMap; },
	__reset: function() {
		index = 0;
		idMap = {};
		wcrFired = false;
	},
	clear: function(id) {
		var fastDomId = id;
		if (idMap[id] !== undefined) {
			if (idMap[id].id === 'pending') {
				idMap[id].id = 'cleared';
				return;
			} else if (idMap[id].id === 'cleared') {
				return;
			} else {
				fastDomId = idMap[id].id;
			}
		}
		if (window['fastdom']) {
			window['fastdom'].clear(fastDomId);
		}
	},
	measure: function(cb) {
		return helper('measure', cb);
	},
	mutate: function(cb) {
		return helper('mutate', cb);
	}
};
