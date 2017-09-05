// Options for the toast
var options = {
    text: "Happy toasting!",
    duration: 1500,
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
}, 2000);

Toastify({
    text: "Time to get started!",
    duration: 5000,
    destination: 'https://github.com/apvarun/toastify-js',
    newWindow: true
}).showToast();

// Displaying toast on manual action `Try`
document.getElementById('new-toast').addEventListener('click', function () {
    Toastify({
        text: "This is a toast",
        duration: 3000
    }).showToast();
});
