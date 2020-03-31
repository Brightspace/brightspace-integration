'use strict';

const CDataLeftString = '<![CDATA[';
const CDataRightString = ']]>';
const DoubleQuoteChar = '"';
const EolString = '\r\n';
const EqualsDoubleQuoteString = '="';
const IndentChar = ' ';
const IndentSize = 2;
const SlashChar = '/';
const SpaceChar = ' ';
const TagLeftChar = '<';
const TagRightChar = '>';

const EscapeMap = new Map([['"', '&quot;'], ['&', '&amp;'], ['<', '&lt;'], ['>', '&gt;'], ["'", '&apos;']]);
const EscapeRegExp = /["'&<>]/g;
const EscapeReplacer = (_, ch) => EscapeMap.get(ch);

class XmlSerializer {

	constructor() {

		this._indent = 0;
		this._result = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
		this._result += EolString;
		this._shouldWriteIndent = false;
	}

	get indent() {

		return this._indent;
	}

	set indent(value) {

		this._indent = Math.max(0, value);
	}

	toString() {

		return this._result;
	}

	writeTagBegin(tagName) {

		this._writeIndent();
		this._result += TagLeftChar;
		this._result += tagName;
	}

	writeAttribute(name, value) {

		this._writeIndent();
		this._result += SpaceChar;
		this._result += name;

		if (typeof value === 'string' && value.length > 0) {

			this._result += EqualsDoubleQuoteString;
			this._result += this.escape(String(value));
			this._result += DoubleQuoteChar;
		}
	}

	writeTagBeginRightChar() {

		this._writeIndent();
		this._result += TagRightChar;
	}

	writeFullTagBegin(tagName) {

		this._writeIndent();
		this._result += TagLeftChar;
		this._result += tagName;
		this._result += TagRightChar;
	}

	writeText(text) {

		this._writeIndent();
		this._result += CDataLeftString;
		if (typeof text === 'string' && text.length > 0) {
			this._result += text;
		}
		this._result += CDataRightString;
	}

	writeTagEnd(tagName) {

		this._writeIndent();
		this._result += TagLeftChar;
		this._result += SlashChar;
		this._result += tagName;
		this._result += TagRightChar;
	}

	writeLine() {

		this._result += EolString;
		this._shouldWriteIndent = true;
	}

	escape(value) {

		return value.replace(EscapeRegExp, EscapeReplacer);
	}

	_writeIndent() {

		if (this._shouldWriteIndent) {
			this._result += IndentChar.repeat(this._indent * IndentSize);
			this._shouldWriteIndent = false;
		}
	}
}

module.exports = XmlSerializer;
