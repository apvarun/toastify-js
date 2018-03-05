# Toastify

![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)
![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)

[![toastify-js](https://img.shields.io/badge/toastify--js-1.2.0-brightgreen.svg)](https://www.npmjs.com/package/toastify-js)

Toastify is a lightweight, vanilla JS toast notification library.

## Demo

[Click here](https://apvarun.github.io/toastify-js/)

## Features

- Multiple stacked notifications
- Customizable
- No blocking of execution thread

### Customization options

- Notification Text
- Duration
- Toast background color
- Close icon display
- Display position

## Installation

#### Toastify now supports installation via NPM

- Run the below command to add toastify-js to your exisitng or new project.
```
npm install --save toastify-js
```
or
```
yarn add toastify-js -S
```

- Import toastify-js into your module to start using it.
```
import Toastify from 'toastify-js'
```

#### Adding ToastifyJs to HTML page using the traditional method

To start using **Toastify**, add the following CSS on to your page.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
```

And the script at the bottom of the page

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
```
> Files are delivered via the CDN service provided by [jsdeliver](https://www.jsdelivr.com/)

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

## Browsers support

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)<br />IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)<br />Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)<br />Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)<br />Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)<br />Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 10 versions| last 10 versions| last 10 versions| last 10 versions

## License

MIT © [Varun A P](https://github.com/apvarun)
