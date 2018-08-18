<a name="module_TranslateWebpackPlugin"></a>

## TranslateWebpackPlugin
A webpack plugin for scanning javscript files to build translation mappings in json automatically.

[![Build Status](https://travis-ci.org/zakkudo/translate-webpack-plugin.svg?branch=master)](https://travis-ci.org/zakkudo/translate-webpack-plugin)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/translate-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/translate-webpack-plugin?branch=master)

Why use this?

- You no longer have to manage hierarchies of translations
- Templates are automatically generated for the translators
- The translations are noted if they are new, unused and what files
- It allows splitting the translations easily for dynamic imports to allow sliced loading
- Any string wrapped in `__()` or `__n()`, will be picked up as a translatable making usage extremely easy for developers

What does it do?

- I generates a locales directory filled with templates where the program was run, used by humans to translate
- It generates .locale directories optimized for loading in each of the directories passed to targets
- You load those translations from .locales as you need them

Install with:

```console
yarn add @zakkudo/translate-webpack-plugin
```

Also consider `@zakkudo/translator` for a library that can read the localization with
no fuss and apply the translations.

**Example** *(Usage for just translating everything in a project)*  
```js
const TranslateWebpackPlugin = require('@zakkudo/translate-webpack-plugin');
webpackConfig.plugins.push(new TranslateWebpackPlugin({
    files: 'src/**/*.js', // Analyzes all javscript files in the src directory
    debug: true, // Enables verbose output
    locales: ['fr', 'en'], // generate a locales/fr.json as well as a locales/en.json
    target: 'src' // Each page in the folder will get it's own subset of translations
}));
```
**Example** *(Usage for splitting transaltions between dynamically imported pages of a web app)*  
```js
const TranslateWebpackPlugin = require('@zakkudo/translate-webpack-plugin');
webpackConfig.plugins.push(new TranslateWebpackPlugin({
    files: 'src/**/*.js', // Analyzes all javscript files in the src directory
    debug: true, // Enables verbose output
    locales: ['fr', 'en'], // generate a locales/fr.json as well as a locales/en.json
    target: 'src/pages/*' // Each page in the folder will get it's own subset of translations
}));
```
**Example** *(Generated translation templates)*  
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
**Example** *(Use the translations with @zakkudo/translator)*  
```js
import Translator from '@zakkudo/translator';
import localization = from './src/.locales/ja.json'; //Generated by the analyzer

const translator = new Translator();
translator.mergeLocalization('ja', localization); //Load the localization
translator.setLocale('ja'); //Tell the translator to use it

const translated = translator.__('I love fish'); //Translate!
const translated = translator.__n('There is a duck in the pond.', 'There are %d ducks in the pond', 3); //Translate!
```
