'use strict';

class Lang {

	constructor(code, lang, culture) {
		this.code = code;
		this.lang = lang;
		this.culture = culture;
	}

	toString() {

		return this.code;
	}
}

module.exports = Lang;
