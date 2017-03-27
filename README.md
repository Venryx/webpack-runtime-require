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
let React = Require("react");
console.assert(React.Component != null);
```

Alternately, you can require the `Require` function (oh, the meta!) from compile-time code and then use it directly:
```
import {Require} from "react-runtime-require";
Require("react");
```