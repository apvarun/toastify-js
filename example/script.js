var bgColors = [
  "linear-gradient(to right, #00b09b, #96c93d)",
  "linear-gradient(to right, #ff5f6d, #ffc371)",
];
var gravity = ["top", "bottom"];
var position = ["left", "center", "right"];

Toast({
  text: "Hi",
  gravity: "top",
  position: 'left',
  onClick(e) {
    console.log(e);
    window.open("https://github.com/apvarun/toastify-js");
    this.hide();
  }
}).show();

setTimeout(function () {
  Toast({
    text: "Simple JavaScript Toasts",
    gravity: "top",
    position: 'center',
    style: {
      background: '#0f3443'
    }
  }).show();
}, 1000);

// Options for the toast
var options = {
  text: "Happy toasting!",
  duration: 2500,
  onClose() {
    console.log("Toast hidden");
  },
  close: true,
  style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  }
};

// Initializing the toast
var myToast = Toast(options);

// Toast after delay
setTimeout(function () {
  myToast.show();
}, 4500);

setTimeout(function () {
  Toast({
    text: "Highly customizable",
    gravity: "bottom",
    position: 'left',
    close: true,
    style: {
      background: "linear-gradient(to right, #ff5f6d, #ffc371)",
    }
  }).show();
}, 3000);


document.getElementById("new-toast").addEventListener("click", function () {
  let g = gravity.at(Math.floor(Math.random() * gravity.length))
  let p = position.at(Math.floor(Math.random() * position.length))
  Toast({
    text: `I am a ${g} ${p} toast`,
    duration: 3000,
    gravity: g,
    position: p,
    close: Math.random() >= 0.5,
    style: {
      background: bgColors[Math.floor(Math.random() * bgColors.length)],
    }
  }).show();
});
