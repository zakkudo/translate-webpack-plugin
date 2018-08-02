module.exports = function startsWith(haystack, index, needle) {
    return haystack.substring(index, index + needle.length) === needle;
}
