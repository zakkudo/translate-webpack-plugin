# @zakkudo/translate-webpack-plugin

A webpack plugin for scanning javscript files to build translation mappings in json automatically.

[![Build Status](https://travis-ci.org/zakkudo/translate-webpack-plugin.svg?branch=master)](https://travis-ci.org/zakkudo/translate-webpack-plugin)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/translate-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/translate-webpack-plugin?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/zakkudo/translate-webpack-plugin/badge.svg)](https://snyk.io/test/github/zakkudo/translate-webpack-plugin)
[![Node](https://img.shields.io/node/v/@zakkudo/translate-webpack-plugin.svg)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/@zakkudo/translate-webpack-plugin.svg)](https://opensource.org/licenses/BSD-3-Clause)

## Why use this?

- You no longer have to manage hierarchies of translations
- Templates are automatically generated for the translators
- The translations are noted if they are new, unused and what files
- It allows splitting the translations easily for dynamic imports to allow sliced loading
- Any string wrapped in `__()` or `__n()`, will be picked up as a
  translatable making usage extremely easy for developers

## What does it do?

- It searches your source code for translatable strings and aggregates them
- It writes human-centric translation templates in json5 showing usages, new strings and no longer used strings
- It generates developer-centric optimized json templates, stripping away any unused strings and metadata

## Install

```console
# Install using npm
npm install @zakkudo/translate-webpack-plugin
```

``` console
# Install using yarn
yarn add @zakkudo/translate-webpack-plugin
```

## Setup
1. Wrap strings you want to be translated in `__('text')` or `__n('singlular', 'plural', number)` using a library like `@zakkudo/translator`
2. Add the plugin to webpack
``` javascript
const TranslateWebpackPlugin = require('@zakkudo/translate-webpack-plugin');

module.exports = {
    plugins: [
        new TranslateWebpackPlugin({
            // Analyzes all javscript files in the src directory, which is a good initial value
            files: 'src/**/*.js',
            // Use verbose output to see what files are parsed, what keys are extracted, and where they are being written to
            debug: true,
            // You do not need to add your default language (which for most people will be English)
            locales: ['fr'],
            // Consolidate all of the optimized localizations into `src/.locale`, good as an initial configuration
            target: 'src'
        })
    ]
};
```
3. Add `.locales` to your `.gitignore` so it isn't commited.  It is a dynamic source file that has no value being added to a repository. Its existance in the `src` directory is simply to facilitate importing it.
4. Add `find src -name '.locales' | xargs rm -r` to your clean scripts for an easy way to remove the auto generated `src/.locales` from your source code
5. Import locales into your source code from the `src/.locales` folder so you can merge it into the lookup of `@zakkudo/translator`.  It is plain old json with the untranslated and unexisting values optimized out.
6. Have your localization team use the files from `locales` (without a period.)  It's annoted with information about new, unused, and existing usages of the translations to help them audit what needs updating.

You'll end up with a file structure similar to below.
```
File Structure
├── locales <- For your translators
│   ├── en.json
│   └── fr.json
└── src
    ├── .locales <- For your developers
    │   ├── en.json
    │   └── fr.json
    └── pages
        ├── About
        │   └── index.js
        └── Search
            └── index.js
```

Where `locales/fr.json` will look like this for use by your translators:
``` json5
{
    // NEW
    // src/pages/AboutPage/index.js:14
    "About": "",
    // UNUSED
    "Search Page": "French translation",
    // src/pages/AboutPage/index.js:40
    "There is one user": {"one":"French translation", "other":"French translation"},
    // src/pages/AboutPage/index.js:38
    "Welcome to the about page!": "French translation"
}
```

And the optimized `src/.locales/fr.json` will look like this for use by your developers:
``` json
{
    "There is one user": {"one":"French translation", "other":"French translation"},
    "Welcome to the about page!": "French translation"
}
```

Your developers will use the translation similarly to below:
``` javascript
import Translator from '@zakkudo/translator';
import fr from 'src/.locales/fr.json';
const translator = new Translator();
const {__, __n} = translator;
const language = navigator.language.split('-')[0];

translator.setLocalization('fr', fr);
translator.setLocale(language);

document.title = __('About');
document.body.innerHTML = __n('There is one user', 'There are %d users', 2);
```

## Examples

### Configure the plugin to build a single `.locales` directory
``` javascript
module.exports = {
    plugins: [
        new TranslateWebpackPlugin({
            files: 'src/**/*.js',
            locales: ['es', 'fr'],
            target: 'src'
        });
    ]
};
```

```
File Structure
├── locales <- For your translators. Contains translations for everything
│   ├── es.json
│   └── fr.json
└── src
    ├── Application.js
    ├── .locales <- For your developers. Contains translations for everything
    │   ├── es.json
    │   └── fr.json
    └── pages
        ├── About
        │   └── index.js
        └── Search
            └── index.js
```


### Configure the plugin for a split `.locales` directory
``` javascript
module.exports = {
    plugins: [
        new TranslateWebpackPlugin({
            files: 'src/**/*.js',
            locales: ['es', 'fr'],
            target: 'src/pages/*'
        })
    ]
};
```

```
File Structure
├── locales <- For your translators. Contains translations for everything
│   ├── es.json
│   └── fr.json
└── src
    ├── Application.js
    └── pages
        ├── About
        │   ├── .locales <- For your developers. Contains translations for `Application.js` and `About/index.js`
        │   │   ├── es.json
        │   │   └── fr.json
        │   └── index.js
        └── Search
            ├── .locales <- For your developers. Contains translations for `Application.js` and `Search/index.js`
            │   ├── es.json
            │   └── fr.json
            └── index.js
```

## Also see

- `@zakkudo/translation-static-analyzer` for the generic library that this
package thinly wraps
- `@zakkudo/translator` is a library that can read the localization with
no fuss and apply the translations.
- [Polymer 3 Starter Project](https://github.com/zakkudo/polymer-3-starter-project)
is an example project using this library.
