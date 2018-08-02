const startsWith = require('./startsWith');

describe('startsWith', () => {
    it('matches', () => {
        expect(startsWith('abc', 1, 'bc')).toBe(true);
    });

    it('doesn\'t match', () => {
        expect(startsWith('abc', 0, 'bc')).toBe(false);
    });

    it('matches blank', () => {
        expect(startsWith('abc', 0, '')).toBe(true);
    });
});
