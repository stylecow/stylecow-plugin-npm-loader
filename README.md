stylecow plugin npm-loader
==========================

[![Build Status](https://travis-ci.org/stylecow/stylecow-plugin-npm-loader.svg)](https://travis-ci.org/stylecow/stylecow-plugin-npm-loader)

Stylecow plugin to resolve automatically the css paths of packages installed with [npm](http://npmjs.com/). To do that, it search for the "style" property used in many packages.

You write:

```css
@import "magnific-popup";
```

And stylecow resolves the path and converts to:

```css
@import url("../node_modules/magnific-popup/dist/magnific-popup.css");
```

You can combine this plugin with [import](https://github.com/stylecow/stylecow-plugin-import) to insert the css code instead resolve only the url.

More demos in [the tests folder](https://github.com/stylecow/stylecow-plugin-npm-loader/tree/master/tests/cases)
