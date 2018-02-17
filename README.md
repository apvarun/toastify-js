# Toastify

![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)
![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)

Toastify is a lightweight, vanilla JS toast notification library.

## Demo

[Click here](https://apvarun.github.io/toastify-js/)

## Download

To start using **Toastify**, add the following on to your page.

```html
<link rel="stylesheet" type="text/css" href="toastify.css">
```

Add script at the bottom of the page

```html
<script type="text/javascript" src="toastify.js"></script>
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

Toast messages will be centered on devices with screen width less than 360px.

+ See the [changelog](https://github.com/apvarun/toastify-js/blob/master/CHANGELOG.md)

## License

MIT © [Varun A P](https://github.com/apvarun)
