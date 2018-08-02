const isQuoteCharacter = require('./isQuoteCharacter');
const isWhiteSpaceCharacter = require('./isWhiteSpaceCharacter');

function continueToQuoteStart(text, state) {
    const readCharacter = require('./readCharacter');

    while ((state = readCharacter(text, state)) !== null) {
        const character = text.charAt(state.index);

        if (isQuoteCharacter(state.stack[0])) {
            break;
        }

        if (!isQuoteCharacter(character) && !isWhiteSpaceCharacter(character)) {
            throw new SyntaxError('localization key must be a literal');
        }
    }

    return state;
}

function continueUntilStackLengthIs(text, state, length) {
    const readCharacter = require('./readCharacter');

    while ((state = readCharacter(text, state)) !== null) {
        if (state.stack.length <= length) {
            break;
        }
    }

    return state;
}

module.exports = function parseLocalizationFunction(text, {index, stack, lineNumber}) {
    const functionStart = {index, stack, lineNumber};

    index += 1;

    if (text.charAt(index + 1) === '(') {
        index += 1;
    }

    const keyStart = continueToQuoteStart(text, {index, stack, lineNumber});
    const keyEnd = continueUntilStackLengthIs(text, {...keyStart}, keyStart.stack.length - 1);

    if (keyStart.index === keyEnd.index - 1) {
        throw new SyntaxError('empty localization key');
    }

    const functionEnd = (keyEnd.stack[0] === '(') ?
        continueUntilStackLengthIs(text, {...keyEnd}, keyEnd.stack.length - 1) : keyEnd;

    return {
        ...functionEnd,
        key: text.substring(keyStart.index, keyEnd.index - 1),
        fn: text.substring(functionStart.index, functionEnd.index),
    };
}
