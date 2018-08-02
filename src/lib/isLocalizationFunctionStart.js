const translationStartPatterns = [
    '__(',
    '__`',
    `__n(`,
    '__n`',
];

const length = translationStartPatterns
    .reduce((accumulator, p) => Math.max(p.length, accumulator), 0);

module.exports = function isLocalizationStart(text, {index}) {
    const testString = text.substring(index, index + length);

    return translationStartPatterns.some((p) => testString.startsWith(p));
}
