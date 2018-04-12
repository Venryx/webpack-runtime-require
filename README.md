# Webpack Runtime Require

Exposes a way to require module exports at runtime. (eg. in browser consoles)

Supports Webpack versions 1, 2, and 4. (haven't tried 3)

### Install

```
npm install --save webpack-runtime-require
```

### Usage

1) Add some way for the library to access the webpack data. You can do this in one of three ways.  
A) Run the line `window.webpackData = __webpack_require__;` prior to importing the library.  
B) Have webpack make the `webpackJsonp` function available on `window`. To do so, add the CommonsChunkPlugin to webpack's config:
```
// Stub, to make the webpackJsonp function available. (you don't actually have to have the plugin do anything)
// If someone knows of a better way of exposing the function, let me know!
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({names: ["vendor"]}));
```
C) Load the library's code as a raw TypeScript module (instead of the regular UMD dist output) by adding `module: "src/Main.ts"` to the library's package.json file. This gives it direct access to the `__webpack_require__` function, and with it, the attached module list/data.

2) In your `webpack.config.js` file, set `config.output.pathinfo` to `true`. (if you don't set this, it falls back to guessing the module's name from the variables where it's imported)

3) Require the module at least once.
```
import "webpack-runtime-require";
```

It will then add a `Require()` function to the `window` object, for use in the console, or anywhere in your code.

4) Then just use it, like so:
```
let React = Require("react");
console.log("Retrieved React.Component: " + React.Component);

// if path was "./Path/To/MyComponent", specify just the file-name
let MyComponent = Require("MyComponent");
console.log("Retrieved MyComponent: " + MyComponent);
```

Alternately, you can require the `Require` function (oh, the meta!) from compile-time code and then use it directly:
```
import {Require} from "webpack-runtime-require";
Require("react");
```

### Troubleshooting

#### Even after setting `window.webpackData`, no modules are found

* If you're using Webpack 4, this may be because you've set `mode: "development"` or `optimization.namedModules: true`. Try setting `optimization.namedModules: false` for now. (until it's fixed)

### Additional usage

If you're using the dev-tools Console, you can see autocomplete for the modules:

1) Type and run: `Require()`
2) Type: `Require.`

You should then see all the modules in your app displayed in the autocomplete dropdown.