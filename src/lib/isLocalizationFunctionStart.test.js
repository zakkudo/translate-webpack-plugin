const isLocalizationFunctionStart = require('./isLocalizationFunctionStart');

describe('isLocalizationFunctionStart', () => {
    it('returns false for before with single quote', () => {
        expect(isLocalizationFunctionStart(`a __('a')`, {index: 0})).toBe(false);
    });

    it('returns true when index is start with single quote', () => {
        expect(isLocalizationFunctionStart(`a __('a')`, {index: 2})).toBe(true);
    });

    it('returns false when afterw ith single quote', () => {
        expect(isLocalizationFunctionStart(`a __('a')`, {index: 4})).toBe(false);
    });

    it('returns false for before with double quote', () => {
        expect(isLocalizationFunctionStart(`a __("a")`, {index: 0})).toBe(false);
    });

    it('returns true when index is start with double quote', () => {
        expect(isLocalizationFunctionStart(`a __("a")`, {index: 2})).toBe(true);
    });

    it('returns false when afterw ith double quote', () => {
        expect(isLocalizationFunctionStart(`a __("a")`, {index: 4})).toBe(false);
    });

    it('returns false for before with backtick quote', () => {
        expect(isLocalizationFunctionStart('a __(`a`)', {index: 0})).toBe(false);
    });

    it('returns true when index is start with backtick quote', () => {
        expect(isLocalizationFunctionStart('a __(`a`)', {index: 2})).toBe(true);
    });

    it('returns false when afterw ith backtick quote', () => {
        expect(isLocalizationFunctionStart('a __(`a`)', {index: 4})).toBe(false);
    });

    it('returns false for before with short', () => {
        expect(isLocalizationFunctionStart('a __`a`', {index: 0})).toBe(false);
    });

    it('returns true when index is start with short', () => {
        expect(isLocalizationFunctionStart('a __`a`', {index: 2})).toBe(true);
    });

    it('returns false when afterw with short', () => {
        expect(isLocalizationFunctionStart('a __`a`', {index: 4})).toBe(false);
    });
});
