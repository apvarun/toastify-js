var options = {
    value: "Happy toasting!"
};

var myToast = Toastify(options);

setTimeout(function () {
    myToast.showToast(myToast.buildToast());
}, 2000);

myToast.showToast(Toastify({
    value: "Time to get started!"
}).buildToast());
