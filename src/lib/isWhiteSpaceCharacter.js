const whiteSpaceCharacters = new Set([
    ' ',
    '   ',
]);

module.exports = function isWhiteSpaceCharacter(character) {
    return whiteSpaceCharacters.has(character);
}
