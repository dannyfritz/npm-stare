# npm-stare

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dannyfritz/npm-stare?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Keep an eye on your files and run `npm script` when they change. Configurable in your `package.json`.

[![NPM](https://nodei.co/npm/npm-stare.png?downloads=true&stars=true)](https://nodei.co/npm/npm-stare/)

## Installation

### npm

```sh
$ npm install --save-dev npm-stare
```

### package.json

Put a `stare` in `scripts` that runs `npm-stare`.

Then put all your watch directives in `stare`.

```json
{
  "name": "example",
  "version": "0.0.0",
  "description": "An example package.json.",
  "scripts": {
    "stare": "npm-stare",
    "build": "browserify index.js > app.js",
    "test": "tape tests"
  },
  "stare": {
    "build": {
      "path": [
        "lib/",
        "bin/"
      ]
    },
    "test": {
      "path": "lib/"
    }
  },
  "devDependencies": {
    "tape": "*",
    "browseify": "*"
  }
}
```

## Running

```sh
$ npm run stare
```

The utility will now run, watching and running scripts, until you terminate it.
