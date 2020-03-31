'use strict';

const LangObject = require('./LangObject');
const Util = require('./Util');

class LangCollection {

	constructor(name) {
		this._name = Util.escapeObjectName(name);
		this._objects = new Map();
	}

	get name() {
		return this._name;
	}

	get objects() {

		return this._objects.values();
	}

	addObject(object) {

		if (!(object instanceof LangObject)) {
			throw new Error('Expected an instance of LangObject.');
		}

		if (this._objects.has(object.name)) {
			throw new Error(
				'Object "' + object.name + '" already present in the collection.'
			);
		}

		this._objects.set(object.name, object);
		return this;
	}

	getObject(name) {

		return this._objects.get(name);
	}

	writeTo(serializer) {

		serializer.writeTagBegin('collection');
		serializer.writeAttribute('name', this._name);
		serializer.writeAttribute('type', 'Standard');
		serializer.writeTagBeginRightChar();
		serializer.writeLine();
		serializer.indent++;

		const entries = Array.from(this._objects);

		entries.sort(Util.byFirstArrayItem);

		for (const [, object] of entries) {

			object.writeTo(serializer);
		}

		serializer.indent--;
		serializer.writeTagEnd('collection');
		serializer.writeLine();
	}
}

module.exports = LangCollection;
