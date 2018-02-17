# Toastify

![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)
![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)

[![toastify-js](https://img.shields.io/badge/toastify--js-1.0.0-brightgreen.svg)](https://www.npmjs.com/package/toastify-js)

Toastify is a lightweight, vanilla JS toast notification library.

## Demo

[Click here](https://apvarun.github.io/toastify-js/)

## Installation

#### Toastify now supports installation via NPM

```
npm install --save toastify-js
```
or
```
yarn add toastify-js -S
```

#### Using Toastify using the traditional method

To start using **Toastify**, add the following CSS on to your page.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
```

And the script at the bottom of the page

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
```

## Documentation

```javascript
Toastify({
    text: "This is a toast",
    duration: 3000,
    destination: 'https://github.com/apvarun/toastify-js',
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    positionLeft: true, // `true` or `false`
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
}).showToast();
```

> Toast messages will be centered on devices with screen width less than 360px.

+ See the [changelog](https://github.com/apvarun/toastify-js/blob/master/CHANGELOG.md)

## License

MIT © [Varun A P](https://github.com/apvarun)
