import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

if (document.getElementById('d2l-table-style') === null) {
	const style = document.createElement('style');
	style.id = 'd2l-table-style';
	style.appendChild(document.createTextNode(tableStyles.cssText));
	document.head.appendChild(style);
}
