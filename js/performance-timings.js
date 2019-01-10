import webComponentsReady from './d2l-web-components-ready.js';

(function() {

	if (!window.performance
		|| !window.performance.mark
		|| !window.performance.measure
		|| !window.performance.getEntriesByName) return;

	var wcReadyFired = false,
		pageLoadedFired = false,
		measured = false;

	function dispatchPerformanceMeasureEvent(name, measure) {
		document.dispatchEvent(new CustomEvent('d2l-performance-measure', {
			bubbles: true,
			detail: { name: name, value: measure }
		}));
	}

	function measure(name, startMark, endMark, fireEvent) {
		window.performance.measure(name, startMark, endMark);
		// following should be replaced with PerformanceObserver when IE/Edge support it
		var measure = window.performance.getEntriesByName(name, 'measure');
		if (measure.length === 1 && fireEvent) {
			dispatchPerformanceMeasureEvent(name, measure[0]);
		}
	}

	function wcReady() {
		if (wcReadyFired) return;
		wcReadyFired = true;
		window.performance.mark('webComponentsReady');
		tryMeasure();
	}

	function pageLoaded() {
		pageLoadedFired = true;
		tryMeasure();
	}

	function tryMeasure() {
		if (!wcReadyFired || !pageLoadedFired || measured) return;
		measured = true;
		measure('d2l.page.preFetch', 'navigationStart', 'fetchStart', false);
		measure('d2l.page.domInteractive', 'fetchStart', 'domInteractive', false);
		measure('d2l.page.domContentLoadedHandlers', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', false);
		measure('d2l.page.load', 'fetchStart', 'loadEventStart', false);
		measure('d2l.page.server', 'requestStart', 'responseStart', false);
		measure('d2l.page.download', 'responseStart', 'responseEnd', false);
		measure('d2l.page.timeToClient', 'navigationStart', 'responseEnd', true);
		measure('d2l.page.webComponentsReady', 'navigationStart', 'webComponentsReady', true);
	}

	if (document.readyState === 'complete') {
		pageLoaded();
	} else {
		addEventListener('load', pageLoaded);
	}

	webComponentsReady.WebComponentsReady.then(wcReady);

	if ('PerformanceObserver' in window) {
		var observer = new PerformanceObserver(function(observerList) {
			var paintMetrics = observerList.getEntries();
			if (paintMetrics !== undefined && paintMetrics.length > 0) {
				paintMetrics.forEach(function(paintMetric) {
					dispatchPerformanceMeasureEvent('d2l.page.' + paintMetric.name, paintMetric);
				});
			}
		});

		try {
			observer.observe({
				entryTypes: ['paint']
			});
		} catch (e) {
			// Need to surround this in a try-catch for browsers that have not implemented the paint entryType
		}
	}

	setTimeout(wcReady, 10000);

})();
