jest.mock('@zakkudo/translation-static-analyzer');
jest.mock('chokidar');

const chokidar = require('chokidar');

const TranslateWebpackPlugin = require('.');

describe('TranslateWebpackPlugin', () => {
    beforeEach(() => {
        chokidar.resetMock();
    });

    it('initializes okay with no actions', () => {
        const plugin = new TranslateWebpackPlugin({
            files: 'src/**/*.js',
            debug: true,
            locales: ['fr', 'en'],
            target: 'src/pages/*'
        });

        expect(plugin.analyzer.write.mock.calls).toEqual([]);
        expect(plugin.analyzer.read.mock.calls).toEqual([]);
        expect(plugin.analyzer.update.mock.calls).toEqual([]);
    });

    it('applies the file updates', () => {
        const plugin = new TranslateWebpackPlugin({
            files: 'src/**/*.js',
            debug: true,
            locales: ['fr', 'en'],
            target: 'src/pages/*'
        });

        const compiler = {
            hooks: {
                watchRun: {
                    tap: jest.fn()
                }
            },
            watchFileSystem: {
                watcher: {
                    mtimes: {}
                }
            },
        };

        plugin.apply(compiler);

        const args = compiler.hooks.watchRun.tap.mock.calls[0];

        expect(args[0]).toEqual('TranslateWebpackPlugin');

        const callback = args[1];
        callback(compiler);
    });

    it('handles update with no watch file system gracefully', () => {
        const plugin = new TranslateWebpackPlugin({
            files: 'src/**/*.js',
            debug: true,
            locales: ['fr', 'en'],
            target: 'src/pages/*'
        });

        const compiler = {
            hooks: {
                watchRun: {
                    tap: jest.fn()
                }
            }
        };

        plugin.apply(compiler);

        const args = compiler.hooks.watchRun.tap.mock.calls[0];

        expect(args[0]).toEqual('TranslateWebpackPlugin');

        const callback = args[1];
        callback(compiler);
    });


    describe('watch', () => {
        it('updates the templates when one is modified', () => {
            const plugin = new TranslateWebpackPlugin({
                files: 'src/**/*.js',
                debug: true,
                locales: ['fr', 'en'],
                target: 'src/pages/*'
            });
            const tapMock = jest.fn();
            const compiler = {
                hooks: {
                    watchRun: {
                        tap: tapMock
                    }
                }
            };

            // On construction, none of the io function shsould be called
            expect(plugin.analyzer.update.mock.calls).toEqual([]);
            expect(plugin.analyzer.read.mock.calls).toEqual([]);
            expect(plugin.analyzer.write.mock.calls).toEqual([]);

            plugin.apply(compiler); // Initializes the chokidar watch

            // Update is immediately called when apply is called
            expect(plugin.analyzer.update.mock.calls).toEqual([[]]);
            expect(plugin.analyzer.read.mock.calls).toEqual([]);
            expect(plugin.analyzer.write.mock.calls).toEqual([]);

            //Initialize the watch
            const update = tapMock.mock.calls[0][1];
            update(compiler);
            const listeners = new Map(chokidar.watch.mock.results[0].value.on.mock.calls);
            listeners.get('add')();

            update(compiler);

            // Standard watch update
            expect(plugin.analyzer.update.mock.calls).toEqual([[], [[]]]);
            expect(plugin.analyzer.read.mock.calls).toEqual([]);
            expect(plugin.analyzer.write.mock.calls).toEqual([[]]);
        });

        it('does nothing when update is part of source code change', () => {
            const plugin = new TranslateWebpackPlugin({
                files: 'src/**/*.js',
                debug: true,
                locales: ['fr', 'en'],
                target: 'src/pages/*'
            });

            const compiler = {
                hooks: {
                    watchRun: {
                        tap: jest.fn()
                    }
                }
            };

            plugin.apply(compiler);

            const args = compiler.hooks.watchRun.tap.mock.calls[0];

            expect(args[0]).toEqual('TranslateWebpackPlugin');

            const callback = args[1];
            callback(compiler);

            const listeners = new Map(chokidar.watch.mock.results[0].value.on.mock.calls);

            listeners.get('add')();

            expect(plugin.analyzer.write.mock.calls).toEqual([[]]);
        });
    });
});
