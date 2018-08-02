const readString = require('./readString');

describe('readString', () => {
    it('create key and value when contains translation', () => {
        expect(readString(`a __('b') c`)).toEqual({b: {fn: `__('b')`, lineNumber: 0, index: 9}});
    });

    it('adds nothing when no translation', () => {
        expect(readString(`a c`)).toEqual({});
    });

    it('create key and value when contains shorthand translation', () => {
        expect(readString('a __`b` c')).toEqual({b: {fn: '__`b`', lineNumber: 0, index: 7 }});
    });

    it('handles unclosed parenthesis gracefully', () => {
        expect(readString('a __(`b` c')).toEqual({});
    });
});
