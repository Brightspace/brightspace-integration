'use strict';

const fs = require('fs').promises;
const path = require('path');

const LangCollection = require('./LangCollection');
const LangObject = require('./LangObject');
const Util = require('./Util');

const EmptyString = '';
const MacroCulture = '%CULTURE%';
const MacroLang = '%LANG%';
const ParserPlugin = 'parse_json';
const SourceLanguage = 'en';
const SourceMatch = 'en\\.json$';

const MacroRegExp = new RegExp('(' + MacroCulture + '|' + MacroLang + ')');
const ParseJsRegExp = /^([^\S\r\n]*((['"]).+?\3|[\w\d]+)([^\S\r\n]*:[^\S\r\n]*))(?:(")((?:\\\\|\\"|[^"])+?)"|(')((?:\\\\|\\'|[^'])+?)')([^\S\r\n]*(?:,[^\S\r\n]*)?(?:\/\/[^\S\r\n]*(.*)[^\S\r\n]*)?)/mgi;
const ParseJsNameRegExp = /["']/g;
const ParseJsEscapeRegExp = /\\(['"])/g;
const ParseJsEscapeReplacer = (_, ch) => ch;

let invalidTermFound = false;

class Rewrite {

	constructor(rewrite) {

		this._rewrite = new Map();

		if (!Array.isArray(rewrite)) {
			return;
		}

		for (const entry of rewrite) {

			const [from, to] = entry.split(' ');
			this._rewrite.set(from, to);
		}
	}

	get(from) {

		return this._rewrite.get(from);
	}

	toObject() {

		return Object.fromEntries(this._rewrite);
	}
}

class Serge {

	constructor(rootPath, moduleName, modulePath, sergeConfig) {

		this._rootPath = rootPath;
		this._name = Util.backSlash(path.join(moduleName, sergeConfig.name));
		this._sourceDir = path.join(modulePath, sergeConfig.source_dir);
		this._sourceLanguage = sergeConfig.source_language || SourceLanguage;
		this._sourceMatch = new RegExp(sergeConfig.source_match || SourceMatch);
		this._outputLangRewrite = new Rewrite(sergeConfig.output_lang_rewrite);
		this._outputFilePath = path.join(modulePath, sergeConfig.output_file_path);
		this._parserPlugin =
			sergeConfig.parser_plugin &&
			sergeConfig.parser_plugin.plugin ||
			ParserPlugin;
	}

	get name() {

		return this._name;
	}

	async getSource() {

		try {

			const entities = await fs.readdir(this._sourceDir, { withFileTypes: true });

			for (const entity of entities) {

				if (!entity.isFile()) {
					continue;
				}

				if (!this._sourceMatch.test(entity.name)) {
					continue;
				}

				const sourcePath = path.join(this._sourceDir, entity.name);
				const sourceText = await fs.readFile(sourcePath, 'utf-8');

				return this._parse(sourceText);
			}

			return null;

		} catch (err) {

			if (err.code === 'ENOENT') {
				return null;
			}

			throw err;
		}
	}

	async getTranslation(language) {

		const sourcePath = this._outputFilePath.replace(MacroRegExp, (_, macro) => {

			const rewrite = this._outputLangRewrite.get(language.code);
			if (rewrite) {
				return rewrite;
			}

			switch (macro) {

				case MacroLang:
					return language.lang;

				case MacroCulture:
					return language.culture;

				default:
					throw new Error(`Unsupported macro in "${this._name}" ("${macro}").`);
			}
		});

		try {

			const sourceText = await fs.readFile(sourcePath, 'utf-8');

			return this._parse(sourceText);

		} catch (err) {

			if (err.code === 'ENOENT') {
				return null;
			}

			throw err;
		}
	}

	toManifest() {

		const relativePath = path
			.relative(this._rootPath, this._outputFilePath);

		return {
			name: this._name,
			collectionName: Util.escapeObjectName(this._name),
			resourcePath: Util.ForwardSlashChar + Util.forwardSlash(relativePath),
			outputLangRewrite: this._outputLangRewrite.toObject(),
			parserPlugin: this._parserPlugin
		};
	}

	_parse(text) {

		let result;
		switch (this._parserPlugin) {

			case 'parse_json':
				result = this._parseJson(text);
				break;
			case 'parse_d2l_fra':
				result = this._parseFra(text);
				break;
			case 'parse_js':
				result = this._parseJs(text);
				break;
			default:
				throw new Error(`Unsupported parser plugin for "${this._name}" ("${this._parserPlugin}")`);
		}

		if (invalidTermFound) {
			throw 'OSLO error: Forbidden characters used in LangObject name';
		}

		return result;
	}

	_parseJson(text) {

		const source = JSON.parse(text);
		const entries = Object.entries(source);
		const collection = new LangCollection(this._name);

		for (const [name, defaultValue] of entries) {

			const validName = Util.validLangObjectName(name, this._name);

			if (validName) {
				const object = new LangObject(name, defaultValue, EmptyString);
				collection.addObject(object);
			} else {
				invalidTermFound = true;
			}
		}

		return collection;
	}

	_parseFra(text) {

		const source = JSON.parse(text);
		const entries = Object.entries(source);
		const collection = new LangCollection(this._name);

		for (const entry of entries) {

			const [name, {
				context: description,
				translation: defaultValue
			}] = entry;

			const validName = Util.validLangObjectName(name, this._name);

			if (validName) {
				const object = new LangObject(name, defaultValue, description);
				collection.addObject(object);
			} else {
				invalidTermFound = true;
			}
		}

		return collection;
	}

	_parseJs(text) {

		const matches = text.matchAll(ParseJsRegExp);
		const collection = new LangCollection(this._name);

		for (const match of matches) {

			let name = match[2];
			let defaultValue = match[6] || match[8];
			const description = match[10] || EmptyString;

			name = name.replace(ParseJsNameRegExp, '');
			defaultValue = defaultValue.replace(
				ParseJsEscapeRegExp,
				ParseJsEscapeReplacer
			);

			const validName = Util.validLangObjectName(name, this._name);

			if (validName) {
				const object = new LangObject(name, defaultValue, description);
				collection.addObject(object);
			} else {
				invalidTermFound = true;
			}
		}

		return collection;
	}
}

module.exports = Serge;
