# Webpack Runtime Require

Exposes a way to require module exports at runtime. (eg. in browser consoles)

### Install

```
npm install --save webpack-runtime-require
```

### Usage

1) In your `webpack.config.js` file, set `webpackConfig.output.pathinfo` to `true`. (if you don't set this, it falls back to guessing the module's name from the variables where it's imported)

2) Require the module at least once.
```
import "webpack-runtime-require";
```

It will then add a `Require()` function to the `window` object, for use in the console, or anywhere in your code.

3) Then just use it, like so:
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

### Additional usage

If you're using the dev-tools Console, you can see autocomplete for the modules:

1) Type and run: `Require()`
2) Type: `Require.`

You should then see all the modules in your app displayed in the autocomplete dropdown.