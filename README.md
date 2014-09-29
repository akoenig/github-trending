# github-trending [![Build Status](https://travis-ci.org/akoenig/github-trending.svg?branch=master)](https://travis-ci.org/akoenig/github-trending)

A library for fetching the current trending repositories on GitHub.

## API

```sh
$ npm install --save github-trending
```

### Trending repositories (all languages)

```js

var trending = require('github-trending');

trending(function (err, repositories) {
    console.log(repositories);
});
```

### Trending repositories (particular language)

```js
var trending = require('github-trending');

trending('rust', function (err, repositories) {
    console.log(repositories);
});
```

### Available languages

There is also a function which provides an array with all languages for which
trending repository data is available:

```js
var trending = require('github-trending');

trending.languages(function (err, languages) {
    console.log(languages); // => ['ABAP', 'ActionScript', 'Ada', ...]
});
```

## License

The MIT License (MIT)

Copyright (c) 2014 [André König](http://andrekoenig.info), Germany

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
