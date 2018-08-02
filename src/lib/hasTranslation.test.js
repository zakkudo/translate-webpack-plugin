const hasTranslation = require('./hasTranslation');

describe('hasTranslation', () => {
    it('returns true for empty object', () => {
        expect(hasTranslation({})).toBe(false);
    });

    it('returns false for empty value', () => {
        expect(hasTranslation({a: ''})).toBe(false);
    });

    it('returns true for value', () => {
        expect(hasTranslation({a: 'b'})).toBe(true);
    });

    it('returns true for deep value', () => {
        expect(hasTranslation({a: {b: 'c'}})).toBe(true);
    });

    it('returns false for emtpy deep value', () => {
        expect(hasTranslation({a: {b: ''}})).toBe(false);
    });
});
