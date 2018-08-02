const JSON5 = require('json5');
const equal = require('deep-equal');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const y18n = require('y18n');
const hasTranslation = require('./lib/hasTranslation');
const scrubLocalization = require('./lib/scrubLocalization');
const readString = require('./lib/readString');
const isSubPath = require('./lib/isSubPath');

const defaultLocaleGenerationDirectory = path.resolve('./.locale-gen');
const defaultLocaleGenerationFilename = path.resolve(defaultLocaleGenerationDirectory, 'template.json');

const instance = y18n({
    updateFiles: true, //If it doesn't write the file, it also don't update the cache
    directory: defaultLocaleGenerationDirectory,
    locale: 'template',
});

function calculateTargetFiles(targetDirectories, all) {
    const target = all.reduce((accumulator, a) => {
        let unused = true;

        targetDirectories.forEach((t) => {
            if (isSubPath(t, a)) {
                if (!accumulator[t]) {
                    accumulator[t] = new Set([a]);
                } else {
                    accumulator[t].add(a)
                }

                unused = false;
            }
        });

        if (unused) {
            targetDirectories.forEach((t) => {
                if (!accumulator[t]) {
                    accumulator[t] = new Set([a]);
                } else {
                    accumulator[t].add(a);
                }
            });
        }

        return accumulator;
    }, {});

    return Object.keys(target).reduce((accumulator, k) => {
        return Object.assign({}, accumulator, {
            [k]: [...target[k]].sort()
        });
    }, {});
}

function calculateFiles(compiler, options = {}) {
    const {files, target} = options;
    const {watcher= {}} = compiler.watchFileSystem;
    const all = glob.sync(files);
    const mtimes = watcher.mtimes || {};
    const hasModifiedFiles = Boolean(Object.keys(mtimes).length);
    const modified = hasModifiedFiles ? all.filter((f) => mtimes[f]) : all;
    const targetDirectories = glob.sync(target).filter((t) => fs.statSync(t).isDirectory());
    const filesByTargetDirectory = calculateTargetFiles(targetDirectories, all);

    return {
        all,
        modified,
        target: {
            targetDirectories,
            filesByTargetDirectory,
        },
    };
}

function serializeLocalizationWithMetaData(localizationWithMetadata) {
    const keys = Object.keys(localizationWithMetadata);
    const length = keys.length;

    return keys.reduce((serialized, k, i) => {
        const hasMore = i < length - 1;
        const indent = '    ';
        const note = localizationWithMetadata[k].note;
        const formattedNote = note ? `${indent}// ${note.toUpperCase()}\n` : '';
        const files = localizationWithMetadata[k].files;
        const formattedFiles = files.length ? `${indent}// ` + files.join(`\n${indent}// `) + '\n' : '';

        return `${serialized}${formattedNote}${formattedFiles}${indent}"${k}": ${JSON.stringify(localizationWithMetadata[k].data)}${hasMore ? ',' : ''}\n`;
    }, '{\n') + '}';
}

module.exports = class TranslateWebpackPlugin {
    constructor(options) {
        this.options = options;
        this.sourceByFilename = new Map();
        this.keysByFilename = new Map();
        this.filenamesByKey = new Map();
        this.localizationByLanguage = new Map();
    }

    getDirectory() {
        const options = this.options || {};

        return options.directory || './locales';
    }

    readJSON5FileWithFallback(filename, fallback = null) {
        let data = fallback;

        try {
            data = JSON5.parse(fs.readFileSync(filename));
        } catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }

        return data;
    }

    readLocalization(language) {
        const directory = this.getDirectory();
        const filename = `${directory}/${language}.json`;

        return this.readJSON5FileWithFallback(filename);
    }

    writeLocalizationWithMetadata(language, localization) {
        const directory = this.getDirectory();
        const filename = `${directory}/${language}.json`;
        const serialized = serializeLocalizationWithMetaData(localization);

        fs.writeFileSync(filename, serialized);
    }

    updateLocalization(localization) {
        const template = scrubLocalization(instance.cache.template);
        const filenamesByKey = this.filenamesByKey;
        const keys = [
            ...new Set(Object.keys(localization).concat(Object.keys(template)))
        ].sort();
        const fallbackFiles = new Set();

        return keys.reduce((accumulator, k) => {
            const files = [...(filenamesByKey.get(k) || fallbackFiles)].sort();

            if (!template.hasOwnProperty(k) && localization.hasOwnProperty(k) && hasTranslation(localization[k])) {
                return Object.assign({}, accumulator, {
                    [k]: {
                        note: 'unused',
                        files,
                        data: localization[k]
                    }
                });
            } else if (template.hasOwnProperty(k) && (!localization.hasOwnProperty(k) || !hasTranslation(localization[k]))) {
                return Object.assign({}, accumulator, {
                    [k]: {
                        note: 'new',
                        files,
                        data: template[k]
                    }
                });
            } else if (template.hasOwnProperty(k) && localization.hasOwnProperty(k)) {
                return Object.assign({}, accumulator, {
                    [k]: {
                        files,
                        data: localization[k]
                    }
                });
            }

            return accumulator;
        }, {});
    }

    generateLocaleFiles() {
        const options = this.options || {};
        const languages = options.languages || [];
        const localizationByLanguage = this.localizationByLanguage = new Map();

        languages.forEach((l) => {
            const localization = this.readLocalization(l) || {};
            const localizationWithMetadata = this.updateLocalization(localization);

            localizationByLanguage.set(l, localization);

            this.writeLocalizationWithMetadata(l, localizationWithMetadata);
        });
    }

    clear() {
        try {
            fs.unlinkSync(defaultLocaleGenerationFilename);
        } catch (e) {
        }

        instance.cache.template = {};
    }

    parseSourceFiles() {
        const files = this.files.modified;
        const filenamesByKey = this.filenamesByKey = new Map();

        this.clear();

        files.forEach((m) => {
            const contents = String(fs.readFileSync(m));
            const metadata = readString(contents);
            const keysByFilename = this.keysByFilename;
            const sourceByFilename = this.sourceByFilename;

            if (metadata) {
                const keys = Object.keys(metadata);

                Object.values(metadata).forEach((v) => {
                    try {
                        eval(v.fn);
                    } catch(e) {
                        console.warn(e);
                    }
                });

                keys.forEach((k) => {
                    const {lineNumber} = metadata[k];

                    if (!filenamesByKey.has(k)) {
                        filenamesByKey.set(k, new Set());
                    }

                    filenamesByKey.get(k).add(`${m}:${lineNumber}`);
                });

                sourceByFilename.set(m, contents);
                keysByFilename.set(m, new Set(keys));
            }
        });
    }

    writeToTargets() {
        const options = this.options || {};
        const languages = options.languages || [];
        const filesByTargetDirectory = this.files.target.filesByTargetDirectory;
        const targetDirectories = Object.keys(filesByTargetDirectory);
        const localizationByLanguage = this.localizationByLanguage;
        const keysByFilename = this.keysByFilename;

        targetDirectories.forEach((t) => {
            const directory = path.resolve(t, '.locales'); //Initintionally a hidden directory

            try {
                fs.mkdirSync(directory);
            } catch(e) {
                if (e.code !== 'EEXIST') {
                    console.error(e);
                }
            }

            languages.forEach((l) => {
                const filenames = filesByTargetDirectory[t] || [];
                const localization = localizationByLanguage.get(l);
                const subLocalization = {};
                const filename = path.resolve(directory, `${l}.json`);
                const previous = this.readJSON5FileWithFallback(filename);

                filenames.forEach((f) => {
                    const keys = keysByFilename.get(f) || new Set();

                    keys.forEach((k) => {
                        if (localization.hasOwnProperty(k) && hasTranslation(localization[k])) {
                            subLocalization[k] = localization[k]
                        }
                    });
                });

                const previousSubLocalization = this.readJSON5FileWithFallback(filename);

                if (!equal(subLocalization, previousSubLocalization)) {
                    fs.writeFileSync(filename, JSON.stringify(subLocalization, null, 4));
                }

            });
        });
    }

    apply(compiler) {
        compiler.hooks.watchRun.tap("TranslateWebpackPlugin", (compiler) => {
            const options = this.options;
            const files = this.files = calculateFiles(compiler, options)

            if (options.debug) {
                console.log('initializing localizations of', files);
            }

            if (files.modified.length) {
                this.parseSourceFiles();
                this.generateLocaleFiles();
                this.writeToTargets();
            }
        });
    }
}
