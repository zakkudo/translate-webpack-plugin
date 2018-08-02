module.exports = function scrubLocalization(data) {
    return Object.keys(data).reduce((accumulator, k) => {
        if (typeof data[k] === 'string') {
            return Object.assign(accumulator, {[k]: ''});
        } else {
            return Object.assign(accumulator, {[k]: scrubLocalization(data[k])});
        }
    }, {});
}
