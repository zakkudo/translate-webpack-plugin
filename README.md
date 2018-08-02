# translate-webpack-plugin

A webpack plugin for generating localization files using static analysis of source files similar to gettext.
Centralizes your translation file by statically all source files for __n, and __ function usagesin a greedy sort of way.

After searching all the files, template files will be merged into ~/locales/* where you can set the translations you desire.
The filenames with lines will be marked as well as comments saying if old translations are used anymore or if lines are new.

When the targets option is used, the translations will be output to the desired directories and split between them so that you can
create an applicaition that only loads the translations for the current page, but no more.

This plugin is based off of y18n.


Configuration example:

```
    const TranslateWebpackPlugin = require('translate-webpack-plugin');

    new TranslateWebpackPlugin({
        languages: ['ja'],
        files: 'src/Application/**/!(*test|*story|*spec).js',
        target: 'src/Application/pages/*'
    }),
```

Generated translation templates:

```
project $ cat locales/ja.json
{
    // NEW
    // src/Application/pages/AboutPage/index.js:14
    "About": "",
    // UNUSED
    "This isn't used anymore": "So the text here doesn't really do anything",
    // src/Application/pages/AboutPage/index.js:38
    "Welcome to the about page!": "ようこそ"

````
