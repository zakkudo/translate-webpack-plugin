const isSubPath = require('./isSubPath');

describe('isSubPath', () => {
    it('returns true when matches cleanly with no final slash', () => {
        expect(isSubPath('/path', '/path/child')).toBe(true);
    });

    it('returns true when matches cleanly and includes final slash', () => {
        expect(isSubPath('/path/', '/path/child')).toBe(true);
    });

    it('returns true when exactly equal', () => {
        expect(isSubPath('/path/child', '/path/child')).toBe(true);
    });

    it('returns flash when extra characters', () => {
        expect(isSubPath('/path/child', '/path/childextra')).toBe(false);
    });
});
