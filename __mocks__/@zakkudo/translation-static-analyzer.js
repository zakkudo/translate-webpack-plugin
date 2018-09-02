const TranslationStaticAnalyzer = jest.genMockFromModule('@zakkudo/translation-static-analyzer');

module.exports = class TranslationStaticAnalyzerMock {
    constructor(options) {
        this.options = options;

        this.resetMock();
    }

    get templatesDirectory() {
        return 'test template directory';
    }

    resetMock() {
        this.read = jest.fn();
        this.write = jest.fn();
        this.update = jest.fn();
    }
};
