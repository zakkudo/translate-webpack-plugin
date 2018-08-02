const scrubLocalization = require('./scrubLocalization');

describe('scrubLocalization', () => {
    it('does nothing when already empty', () => {
        expect(scrubLocalization({'a': ''})).toEqual({'a': ''})
    });

    it('converts value to an empty string', () => {
        expect(scrubLocalization({'a': 'b'})).toEqual({'a': ''})
    });

    it('scrubs deep strings embedded in objects', () => {
        expect(scrubLocalization({'a': {'b': 'c'}})).toEqual({'a': {'b': ''}})
    });
});
