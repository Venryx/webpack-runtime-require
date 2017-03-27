# Webpack Runtime Require

Exposes a way to require module exports at runtime. (eg. in browser consoles)

### Usage

First, require the module at least once.
```
import "react-runtime-require";
```

It will then add a `Require()` function to the `window` object, for use in the console, or anywhere in your code.

Then just use it, like so:
```
// For packages in "node_modules".

let React = Require("react");
console.log("Retrieved React.Component: " + React.Component);

// For a file with the path "./Source/MyComponent", require string will be "my-component".
// It's not ideal, but webpack strips data so we lose the original name. Use `Object.keys(moduleIDs)` for list of found module-names.

let MyComponent = Require("my-component");
console.log("Retrieved MyComponent: " + MyComponent);
```

Alternately, you can require the `Require` function (oh, the meta!) from compile-time code and then use it directly:
```
import {Require} from "react-runtime-require";
Require("react");
```