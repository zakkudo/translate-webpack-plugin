const TranslationStaticAnalyzer = require('@zakkudo/translation-static-analyzer');

module.exports = class TranslateWebpackPlugin {
    constructor(options) {
        this.analyzer = new TranslationStaticAnalyzer(options);
    }

    apply(compiler) {
        compiler.hooks.watchRun.tap("TranslateWebpackPlugin", (compiler) => {
            const {watcher= {}} = compiler.watchFileSystem;
            const mtimes = watcher.mtimes || {};

            this.analyzer.update(Object.keys(mtimes));
        });
    }
}
