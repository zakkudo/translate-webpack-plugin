const TranslateWebpackPlugin = require('.');

describe('TranslateWebpackPlugin', () => {
    it('initializes', () => {
        const plugin = new TranslateWebpackPlugin({
            files: 'src/**/*.js',
            debug: true,
            locales: ['fr', 'en'],
            target: 'src/pages/*'
        });
    });
});
