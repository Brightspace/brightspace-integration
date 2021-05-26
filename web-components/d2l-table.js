import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

if (document.getElementById('d2l-table-style-shared') === null) {
	const style = document.createElement('style');
	style.id = 'd2l-table-style-shared';
	style.appendChild(document.createTextNode(tableStyles.cssText));
	document.head.appendChild(style);
}
