const readCharacter = require('./readCharacter');

describe('plugins/readCharacter', () => {
    it('reads letters with no special meaning', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = 'abc';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 1,
            stack: [],
            lineNumber: 0
        }, {
            index: 2,
            stack: [],
            lineNumber: 0
        }, {
            index: 3,
            stack: [],
            lineNumber: 0
        }]);
    });

    it('reads a string', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = 'a"b"c';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 1,
            stack: [],
            lineNumber: 0
        }, {
            index: 2,
            stack: ['"'],
            lineNumber: 0
        }, {
            index: 3,
            stack: ['"'],
            lineNumber: 0
        }, {
            index: 4,
            stack: [],
            lineNumber: 0
        }, {
            index: 5,
            stack: [],
            lineNumber: 0
        }]);
    });

    it('reads a string surrounded in parenthesis', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = 'a("b")c';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 1,
            stack: [],
            lineNumber: 0
        }, {
            index: 2,
            stack: ['('],
            lineNumber: 0
        }, {
            index: 3,
            stack: ['"', '('],
            lineNumber: 0
        }, {
            index: 4,
            stack: ['"', '('],
            lineNumber: 0
        }, {
            index: 5,
            stack: ['('],
            lineNumber: 0
        }, {
            index: 6,
            stack: [],
            lineNumber: 0
        }, {
            index: 7,
            stack: [],
            lineNumber: 0
        }]);
    });

    it('doesn\'t add quoted parenthesis to the stack', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = 'a"(b)"c';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 1,
            stack: [],
            lineNumber: 0
        }, {
            index: 2,
            stack: ['"'],
            lineNumber: 0
        }, {
            index: 3,
            stack: ['"'],
            lineNumber: 0
        }, {
            index: 4,
            stack: ['"'],
            lineNumber: 0
        }, {
            index: 5,
            stack: ['"'],
            lineNumber: 0
        }, {
            index: 6,
            stack: [],
            lineNumber: 0
        }, {
            index: 7,
            stack: [],
            lineNumber: 0
        }]);
    });

    it('doesn\'t add commented quotes', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '//"\n""';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 2,
            stack: ['//'],
            lineNumber: 0
        }, {
            index: 3,
            stack: ['//'],
            lineNumber: 0
        }, {
            index: 4,
            stack: [],
            lineNumber: 1
        }, {
            index: 5,
            stack: ['"'],
            lineNumber: 1
        }, {
            index: 6,
            stack: [],
            lineNumber: 1
        }]);
    });

    it('multiline comments comment quotes', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '/*"\n*/""';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 2,
            stack: ['/*'],
            lineNumber: 0
        }, {
            index: 3,
            stack: ['/*'],
            lineNumber: 0
        }, {
            index: 4,
            stack: ['/*'],
            lineNumber: 1
        }, {
            index: 6,
            stack: [],
            lineNumber: 1
        }, {
            index: 7,
            stack: ['"'],
            lineNumber: 1
        }, {
            index: 8,
            stack: [],
            lineNumber: 1
        }]);
    });

    it('parses basic translation function', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '__("a")b';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 7,
            stack: [],
            lineNumber: 0,
            localization: {
                key: 'a',
                fn: '__("a")',
            }
        }, {
            index: 8,
            stack: [],
            lineNumber: 0,
        }]);
    });

    it('parses basic translation function in [[]] interpolation string', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '`[[__("a")]]`';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
			index: 1,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 3,
			stack: [
				"[[",
				"`"
			],
			lineNumber: 0
		}, {
			index: 10,
			stack: [
				"[[",
				"`"
			],
			lineNumber: 0,
			localization: {
				"key": "a",
				"fn": "__(\"a\")"
			}
		}, {
			index: 12,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 13,
			stack: [
			],
			lineNumber: 0
		}]);
    });

    it('parses basic translation function in {{}} interpolation string', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '`{{__("a")}}`';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
			index: 1,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 3,
			stack: [
				"{{",
				"`"
			],
			lineNumber: 0
		}, {
			index: 10,
			stack: [
				"{{",
				"`"
			],
			lineNumber: 0,
			localization: {
				"key": "a",
				"fn": "__(\"a\")"
			}
		}, {
			index: 12,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 13,
			stack: [
			],
			lineNumber: 0
		}]);
    });

    it('parses basic translation function in `${}` interpolation string', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '`${__("a")}`';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
			index: 1,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 3,
			stack: [
				"${",
				"`"
			],
			lineNumber: 0
		}, {
			index: 10,
			stack: [
				"${",
				"`"
			],
			lineNumber: 0,
			localization: {
				"key": "a",
				"fn": "__(\"a\")"
			}
		}, {
			index: 11,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 12,
			stack: [
			],
			lineNumber: 0
		}]);
    });

    it('parses basic translation function in <% %> interpolation string', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '`<%:__("a")%>`';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
			index: 1,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 3,
			stack: [
                "<%",
				"`"
			],
			lineNumber: 0
		}, {
			index: 4,
			stack: [
                "<%",
				"`"
			],
			lineNumber: 0
		}, {
			index: 11,
			stack: [
                "<%",
				"`"
			],
			lineNumber: 0,
			localization: {
				"key": "a",
				"fn": "__(\"a\")"
			}
		}, {
			index: 13,
			stack: [
				"`"
			],
			lineNumber: 0
		}, {
			index: 14,
			stack: [
			],
			lineNumber: 0
		}]);
    });

    it('parses template translation function', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '__`a`b';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 5,
            stack: [],
            lineNumber: 0,
            localization: {
                key: 'a',
                fn: '__`a`',
            }
        }, {
            index: 6,
            stack: [],
            lineNumber: 0,
        }]);
    });

    it('throws an exception when there is no closing quote', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '"';
        const actual = [];

        expect(() => {
            while ((state = readCharacter(text, state)) !== null) {
                actual.push(state);
            }
        }).toThrow(new SyntaxError('text ended with unclosed stack items'));

        expect(actual).toEqual([{
            index: 1,
            stack: ['"'],
            lineNumber: 0,
        }]);

    });

    it('throws an exception when parenthesis is not closed', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '(';
        const actual = [];

        expect(() => {
            while ((state = readCharacter(text, state)) !== null) {
                actual.push(state);
            }
        }).toThrow(new SyntaxError('text ended with unclosed stack items'));

        expect(actual).toEqual([{
            index: 1,
            stack: ['('],
            lineNumber: 0,
        }]);

    });

    it('throws an exception when a close parenthesis is used when there is no open', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = ')';
        const actual = [];

        expect(() => {
            while ((state = readCharacter(text, state)) !== null) {
                actual.push(state);
            }
        }).toThrow(new SyntaxError('missing matching opening brace'));

        expect(actual).toEqual([]);

    });

    it('throws an error when there is no string literal for the translation', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '__(fish)';
        const actual = [];

        expect(() => {
            while ((state = readCharacter(text, state)) !== null) {
                actual.push(state);
            }
        }).toThrow(new SyntaxError('localization key must be a literal'));

        expect(actual).toEqual([]);

    });

    it('throws an error if quote is not the first character', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '__(,"fish")';
        const actual = [];

        expect(() => {
            while ((state = readCharacter(text, state)) !== null) {
                actual.push(state);
            }
        }).toThrow(new SyntaxError('localization key must be a literal'));

        expect(actual).toEqual([]);

    });

    it('throws an error if string is empty', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = '__("")';
        const actual = [];

        expect(() => {
            while ((state = readCharacter(text, state)) !== null) {
                actual.push(state);
            }
        }).toThrow(new SyntaxError('empty localization key'));

        expect(actual).toEqual([]);

    });

    it('iterates * as a normal character', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = 'a*b';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 1,
            stack: [],
            lineNumber: 0,
        }, {
            index: 2,
            stack: [],
            lineNumber: 0,
        }, {
            index: 3,
            stack: [],
            lineNumber: 0,
        }]);

    });

    it('iterates / as a normal character', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = 'a/b';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 1,
            stack: [],
            lineNumber: 0,
        }, {
            index: 2,
            stack: [],
            lineNumber: 0,
        }, {
            index: 3,
            stack: [],
            lineNumber: 0,
        }]);

    });

    it('iterates _ as a normal character', () => {
        let state = {index: 0, stack: [], lineNumber: 0}
        const text = 'a_b';
        const actual = [];

        while ((state = readCharacter(text, state)) !== null) {
            actual.push(state);
        }

        expect(actual).toEqual([{
            index: 1,
            stack: [],
            lineNumber: 0,
        }, {
            index: 2,
            stack: [],
            lineNumber: 0,
        }, {
            index: 3,
            stack: [],
            lineNumber: 0,
        }]);

    });
});
