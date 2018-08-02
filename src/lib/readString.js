const readCharacter = require('./readCharacter');

function readCharacterWithErrorHandling(text, state) {
    let currentState = Object.assign({}, state);
    let nextState;

    while (nextState === undefined) {
        try {
            nextState = readCharacter(text, currentState);
        } catch (e) {
            if (currentState.stack.length) {
                currentState.stack = currentState.stack.slice(1);
            } else {
                currentState.index += 1;
            }
        }
    }

    return nextState;
}

/**
 * Grabs the localization strings from a file.
 * Hard codes what the function names will be...
 * @param {String} text - The source code
 * @return {Array<String>} The strings
 */
module.exports = function readString(text) {
    const localization = {};
    let state = {
        index: 0,
        stack: [],
        lineNumber: 0,
    };
    let previousIndex = 0;

    while ((state = readCharacterWithErrorHandling(text, state)) !== null) {
        if (state.index === previousIndex) {
            const serializedState = JSON.stringify(state, null, 4);
            const slice = text.slice(state.index);

            throw new Error(
                `infinite loop detected\n\n${serializedState}\n\n Problem starts here -> ${slice}`
            );
        }

        if (state.localization) {
            const {key, fn} = state.localization;
            const {index, lineNumber} = state;

            localization[key] = {fn, lineNumber, index};
        }

        previousIndex = state.index;
    }

    return localization;
}

