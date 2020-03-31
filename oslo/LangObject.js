'use strict';

const Util = require('./Util');

class LangObject {

	constructor(name, defaultValue, description) {

		this._name = Util.escapeObjectName(name);
		this._defaultValue = defaultValue;
		this._description = description;
	}

	get name() {

		return this._name;
	}

	get defaultValue() {

		return this._defaultValue;
	}

	get description() {

		return this._description;
	}

	writeTo(serializer) {

		serializer.writeTagBegin('langTerm');
		serializer.writeAttribute('sortOrder', '1');
		serializer.writeAttribute('name', this._name);
		serializer.writeTagBeginRightChar();
		serializer.writeLine();
		serializer.indent++;

		serializer.writeFullTagBegin('defaultValue');
		serializer.writeText(this._defaultValue);
		serializer.writeTagEnd('defaultValue');
		serializer.writeLine();

		serializer.writeFullTagBegin('description');
		serializer.writeText(this._description);
		serializer.writeTagEnd('description');
		serializer.writeLine();

		serializer.indent--;
		serializer.writeTagEnd('langTerm');
		serializer.writeLine();
	}
}

module.exports = LangObject;
