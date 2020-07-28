'use strict';

const LangCollection = require('./LangCollection');
const XmlSerializer = require('./XmlSerializer');
const Util = require('./Util');

class LangPackage {

	constructor(name) {
		this._name = Util.escapeObjectName(name);
		this._collections = new Map();
	}

	get name() {
		return this._name;
	}

	get collections() {

		return this._collections.values();
	}

	addCollection(collection) {

		if (!(collection instanceof LangCollection)) {
			throw new Error('Expected an instance of LangCollection.');
		}

		if (this._collections.has(collection.name)) {
			throw new Error(
				'Collection "' + collection.name + '" already present in the package.'
			);
		}

		this._collections.set(collection.name, collection);
		return this;
	}

	getCollection(name) {

		return this._collections.get(name);
	}

	writeTo(serializer) {

		serializer.writeTagBegin('package');
		serializer.writeAttribute('name', this._name);
		serializer.writeAttribute('type', 'Language');
		serializer.writeAttribute('langtype', 'ICU');
		serializer.writeAttribute('toolid', '0');
		serializer.writeAttribute('version', '0.0.0.0');
		serializer.writeTagBeginRightChar();
		serializer.writeLine();
		serializer.indent++;

		const entries = Array.from(this._collections);

		entries.sort(Util.byFirstArrayItem);

		for (const [, collection] of entries) {

			collection.writeTo(serializer);
		}

		serializer.indent--;
		serializer.writeTagEnd('package');
		serializer.writeLine();

	}

	toXML() {

		const serializer = new XmlSerializer();
		this.writeTo(serializer);
		return serializer.toString();
	}
}

module.exports = LangPackage;
