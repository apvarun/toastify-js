var options = {
    text: "Happy toasting!",
    duration: 500
};

var myToast = Toastify(options);

setTimeout(function () {
    myToast.showToast();
}, 2000);

Toastify({
    text: "Time to get started!",
    duration: 5000
}).showToast();
