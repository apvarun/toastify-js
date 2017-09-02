; (function (global, root) {

    var Toastify = function (options) {

        return new Toastify.lib.init(options);
    },
        version = "0.0.1";

    Toastify.lib = Toastify.prototype = {

        toastify: version,

        constructor: Toastify,

        init: function (options) {

            if (!options) {
                options = {};
            }

            this.options = {};

            this.options.value = options.value || 'Hi there!';
            this.options.duration = options.duration || 3000;
            this.options.root = options.root || root;

            return this;
        },

        buildToast: function () {

            if (!this.options) {
                throw "Toastify is not initialized";
            }

            var divElement = document.createElement("div");
            divElement.className = 'toastify on';
            divElement.innerHTML = this.options.value;

            return divElement;
        },

        showToast: function (toastElement) {

            var rootElement = document.getElementById(this.options.root);

            if (!rootElement) {
                throw "Root element is not defined";
            }

            rootElement.insertBefore(toastElement, rootElement.firstChild);

            var allToasts = document.getElementsByClassName('toastify');

            var topOffset = 15;
            for (var i = 0; i < allToasts.length; i++) {

                var height = allToasts[i].offsetHeight;
                var offset = 15;
                allToasts[i].style.top = topOffset + 'px';

                topOffset += height + offset;
            }

            window.setTimeout(function () {
                toastElement.classList.remove("on");
                window.setTimeout(function () {
                    toastElement.remove();
                }, 600);
            }, this.options.duration);

        }
    }

    Toastify.lib.init.prototype = Toastify.lib;

    global.Toastify = Toastify;

}(window, 'root'));
