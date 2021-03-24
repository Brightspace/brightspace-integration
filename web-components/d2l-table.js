import 'd2l-table/d2l-table.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<custom-style>
	<style is="custom-style" include="d2l-table-style">
		.d2l-grid-mvc > * > tr > td {
			vertical-align: top;
		}
		.d2l-grid-mvc > * > tr > th {
			vertical-align: middle;
		}
	</style>
</custom-style>`;

document.head.appendChild($_documentContainer.content);
