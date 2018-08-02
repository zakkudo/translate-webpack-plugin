module.exports = function hasTranslation(data) {
    const keys = Object.keys(data);

    if (!keys.length) {
        return false;
    }

    return keys.some((k) => {
        if (typeof data[k] === 'string') {
            return Boolean(data[k].length);
        } else {
            return hasTranslation(data[k]);
        }
    });
}
