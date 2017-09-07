// Options for the toast
var options = {
    text: "Happy toasting!",
    duration: 2500,
    callback: function () {
        this.remove();
        Toastify.reposition();
    },
    close: true
};

// Initializing the toast
var myToast = Toastify(options);

// Toast after delay
setTimeout(function () {
    myToast.showToast();
}, 3000);

setTimeout(function () {
    Toastify({
        text: "Highly customizable",
        gravity: "bottom",
        positionLeft: true,
        close: true
    }).showToast();
}, 2000);

Toastify({
    text: "Time to get started!",
    duration: 4500,
    destination: 'https://github.com/apvarun/toastify-js',
    newWindow: true,
    gravity: "top",
    positionLeft: true
}).showToast();

Toastify({
    text: "Pure JavaScript Toasts",
    gravity: "bottom",
    positionLeft: false
}).showToast();

// Displaying toast on manual action `Try`
document.getElementById('new-toast').addEventListener('click', function () {
    Toastify({
        text: "This is a toast",
        duration: 3000
    }).showToast();
});
