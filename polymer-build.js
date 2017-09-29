const vfs = require('vinyl-fs');
const mergeStream = require('merge-stream');
const PolymerProject = require('polymer-build').PolymerProject;

const project = new PolymerProject({
	"entrypoint": "web-components/index.html",
	"fragments": [
		"bsi.html",
		"d2l-activity-exemptions.html",
		"d2l-simple-overlay.html",
	],
	"sources": []
});

mergeStream(project.sources(), project.dependencies())
	.pipe(project.bundler())
	.pipe(vfs.dest('tmp-wc/'));
