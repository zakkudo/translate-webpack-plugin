const quoteCharacters = new Set([
    "'",
    '"',
    "`"
]);

module.exports = function isQuoteCharacter(character) {
    return quoteCharacters.has(character);
}
