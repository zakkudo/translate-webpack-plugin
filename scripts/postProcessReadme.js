#!/usr/bin/env node

const fs = require('fs');

const arguments = process.argv.slice(2);;
const filename = arguments[0];
const contents = String(fs.readFileSync(filename));
const lines = contents.split('\n');

let isIndex = false;
let isApiSection = false;

const newContents = lines.filter((l) => {
    if (l.startsWith('* [@')) {
        isIndex = true;
    } else if (l === '') {
        isIndex = false;
    }

    return !isIndex;
}).filter((l) => {
     return !l.startsWith('### @');
}).map((l, index, lines) => {
    const innerClassOfPrefix = '**Kind**: inner class of';
    const innerMethodOfPrefix = '**Kind**: inner method of';

    if (l.startsWith('#### @')) {
        return l + ' ⏏';
    }

    if (l.startsWith(innerClassOfPrefix)) {
        return '\n**Kind**: Exported class\n';
    }

    if (l.startsWith(innerMethodOfPrefix)) {
        return '\n**Kind**: Exported function\n';
    }

    return l;
}).map((l, index, lines) => {
    if (l === '## API') {
        isApiSection = true;
        return l;
    }

    if (isApiSection && l.startsWith('##')) {
        return l.slice(1);
    }

    return l;
}).join('\n').replace(/\n\n+/gm, '\n\n').replace('&commat;', '@').replace('&sol;', '/');

fs.writeFileSync(filename, newContents);

