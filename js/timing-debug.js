window.addEventListener('d2l-performance-measure', function addTiming(e) {

	var res = /(\?|&)timingdebug=(1|0)/gi.exec(location.search);
	if (res !== null && res.length === 3) {
		var timingVal = (res[2] === '0') ? false : true;
		try {
			if (timingVal) {
				window.sessionStorage.setItem('TimingDebug', '1');
			} else {
				window.sessionStorage.removeItem('TimingDebug');
			}
		} catch (e) {
			// swallow exception
		}
	}

	var timingDebug = false;
	try {
		timingDebug = (window.sessionStorage.getItem('TimingDebug') !== null);
	} catch (e) {
		// swallow exception
	}

	if (!timingDebug) {
		return;
	}

	requestAnimationFrame(function() {

		var timingNode = document.createElement('div');
		var value = (e.detail.value.entryType === 'paint') ? e.detail.value.startTime : e.detail.value.duration;
		timingNode.appendChild(
			document.createTextNode(e.detail.value.name + ': ' + Math.floor(value))
		);

		var div = document.querySelector('.d2l-page-timing');
		if (div === null) {
			div = document.createElement('div');
			div.className = 'd2l-page-timing';
			div.appendChild(timingNode);
			document.body.appendChild(div);
		} else {
			div.appendChild(timingNode);
		}

	});

});
