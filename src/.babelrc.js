module.exports = {
    "presets": [
        [
            "@babel/env", {
                "debug": process.env.NODE_ENV === 'build',
                "targets": {"browsers": [
                    "last 1 version",
                    "> 1%",
                    "not dead"
                ], "node": "6"}
            }
        ]
    ],
    "plugins": [
        ["@babel/transform-runtime", {"corejs": 2}],
        "transform-undefined-to-void"
    ],
    minified: true,
    comments: false
}
