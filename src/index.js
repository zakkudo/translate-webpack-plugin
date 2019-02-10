/**
 * @module @zakkudo/translate-webpack-plugin
 */

const path = require('path');
var chokidar = require('chokidar');
const TranslationStaticAnalyzer = require('@zakkudo/translation-static-analyzer');

/**
 * @private
 */
function writeTemplates() {
    this.analyzer.write();
}

/**
 * @private
 */
function update(compiler) {
    const {watcher = {}} = compiler.watchFileSystem || {};
    const mtimes = watcher.mtimes || {};

    if (!this.watcher) {
        const templateDirectory = this.analyzer.templateDirectory;
        const templatesFilePattern = path.resolve(templateDirectory, '*');

        this.watcher = chokidar.watch(templatesFilePattern)
            .on('add', writeTemplates.bind(this))
            .on('change', writeTemplates.bind(this))
            .on('unlink', writeTemplates.bind(this));

    } else {
        this.analyzer.update(Object.keys(mtimes));
    }
}

/**
 * Plugin for analyzing javascript source files, extracting the translations, and converting them into
 * localization templates.
 */
class TranslateWebpackPlugin {
    /**
     * @param {Object} options - The modifiers for how the analyzer is run
     * @param {String} options.files - A
     * [glob pattern]{@link https://www.npmjs.com/package/glob} of the files to pull translations from
     * @param {Boolean} [options.debug = false] - Show debugging information in the console
     * @param {Array<String>} [options.locales = []] - The locales to generate (eg fr, ja_JP, en)
     * @param {String} [options.templates] - The location to store
     * the translator translatable templates for each language. Defaults to
     * making a `locales` directory in the current working directory
     * @param {String} [options.target] - Where to write the final translations, which can be split between
     * multiple directories for modularity. If there are no targets, no `.locales` directory will be generated anywhere.
     */
    constructor(options) {
        this.analyzer = new TranslationStaticAnalyzer(options);
    }

    /**
     * Method called by the webpack plugin system during watch to inform the plugin when
     * some files have been updated.
     * @param {Object} compiler - The webpack compiler object
     */
    apply(compiler) {
        // Gets called on build and watch. Makes sure there are initial locales for compile
        this.analyzer.update();

        // Register the update callback. The callback is only called on watch.
        compiler.hooks.watchRun.tap("TranslateWebpackPlugin", update.bind(this));
    }
}

module.exports = TranslateWebpackPlugin;
