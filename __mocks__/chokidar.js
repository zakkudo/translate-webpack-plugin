const chokidar = jest.genMockFromModule('chokidar');

chokidar.watch = jest.fn();

chokidar.resetMock = () => {
    chokidar.watch = jest.fn().mockImplementation((pattern) => {
        const instance = {
            on: jest.fn().mockImplementation(() => instance)
        };

        return instance;
    });
}

chokidar.resetMock();

module.exports = chokidar;
