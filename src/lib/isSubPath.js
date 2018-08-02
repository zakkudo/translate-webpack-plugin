module.exports = function isSubPath(path, subPath) {
    return subPath.startsWith(path) &&
        (
            path.length === subPath.length || // /one/two === /one/two
            path.slice(-1) === '/' || // /one/ === /one/two
            subPath.charAt(path.length) === '/' // /one === /one/two
        );
}
