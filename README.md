# Toastify

![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)
![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)

[![toastify-js](https://img.shields.io/badge/toastify--js-1.6.1-brightgreen.svg)](https://www.npmjs.com/package/toastify-js)

Toastify is a lightweight, vanilla JS toast notification library.

## Demo

[Click here](https://apvarun.github.io/toastify-js/)

## Features

* Multiple stacked notifications
* Customizable
* No blocking of execution thread

### Customization options

* Notification Text
* Duration
* Toast background color
* Close icon display
* Display position

## Installation

#### Toastify now supports installation via NPM

* Run the below command to add toastify-js to your exisitng or new project.

```
npm install --save toastify-js
```

or

```
yarn add toastify-js -S
```

* Import toastify-js into your module to start using it.

```
import Toastify from 'toastify-js'
```

You can use the default CSS from Toastify as below and later override it or choose to write your own CSS.

```
import "toastify-js/src/toastify.css"
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
  destination: "https://github.com/apvarun/toastify-js",
  newWindow: true,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: 'left', // `left`, `center` or `right`
  backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  stopOnFocus: true, // Prevents dismissing of toast on hover
  onClick: function(){} // Callback after click
}).showToast();
```

> Toast messages will be centered on devices with screen width less than 360px.

* See the [changelog](https://github.com/apvarun/toastify-js/blob/master/CHANGELOG.md)

### Add own custom classes

If you want to use custom classes on the toast for customizing (like info or warning for example), you can do that as follows:

```javascript
Toastify({
  text: "This is a toast",
  backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  className: "info",
}).showToast();
```

Multiple classes also can be assigned as a string, with spaces between class names.

## Browsers support

| ![][ie]<br />IE / Edge | ![][firefox]<br />Firefox | ![][chrome]<br />Chrome | ![][safari]<br />Safari | ![][opera]<br />Opera |
| ---------------------- | ------------------------- | ----------------------- | ----------------------- | --------------------- |
| IE10, IE11, Edge       | last 10 versions          | last 10 versions        | last 10 versions        | last 10 versions      |

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
|  [![rndevfx](https://avatars2.githubusercontent.com/u/5052076?v=3&s=80)](https://github.com/rndevfx) | [![Wachiwi](https://avatars1.githubusercontent.com/u/4199845?v=3&s=80)](https://github.com/Wachiwi)  |
| :--:|:--: |
|  [rndevfx](https://github.com/rndevfx) | [Wachiwi](https://github.com/Wachiwi)  |

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT © [Varun A P](https://github.com/apvarun)

[ie]: https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png
[firefox]: https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png
[chrome]: https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png
[safari]: https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png
[opera]: https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png
