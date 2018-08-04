# translate-webpack-plugin

A webpack plugin for generating localization files using static analysis of source files similar to gettext.
Centralizes your translation file by statically all source files for `__n`, and `__` function usages in a greedy sort of way.

Why should you use this?

- It's platform antagonistic.  I use it with react, angular, polymer, whatever!
- It greatly simplifies manintain the translation of the project by storing everything in one place
- Automatically updates the translation lists as you develop

<dl>
    <dt>https://github.com/zakkudo/translation-static-analyzer</dt>
    <dd>The generic library this is based upon without webpack.</dd>
    <dt>https://github.com/zakkudo/polymer-3-starter-project</dt>
    <dd>An example project using this library.</dd>
</dl>

After searching all the files, template files will be merged into ~/locales/* where you can set the translations you desire.
The filenames with lines will be marked as well as comments saying if old translations are used anymore or if lines are new.

When the targets option is used, the translations will be output to the desired directories and split between them so that you can
create an applicaition that only loads the translations for the current page, but no more.

This plugin is based off of y18n.

Configuration example:

```js
    const TranslateWebpackPlugin = require('translate-webpack-plugin');

    new TranslateWebpackPlugin({
        languages: ['ja'],
        files: 'src/Application/**/!(*test|*story|*spec).js',
        target: 'src/Application/pages/*'
    }),
```

Generated translation templates:

```js
{
    // NEW
    // src/Application/pages/AboutPage/index.js:14
    "About": "",
    // UNUSED
    "This isn't used anymore": "So the text here doesn't really do anything",
    // src/Application/pages/AboutPage/index.js:38
    "Welcome to the about page!": "ようこそ"
}
```
