const escapeCharacters = new Set([
    `'`,
    '"',
    "`",
    "/*",
    "//"
]);

module.exports = function isEscapeCharacter(character) {
    return escapeCharacters.has(character);
}
