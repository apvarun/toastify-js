; (function (global) {

    // Object initialization
    var Toastify = function (options) {

        // Returning a new init object
        return new Toastify.lib.init(options);
    },
        // Library version
        version = "0.0.1";

    // Defining the prototype of the object
    Toastify.lib = Toastify.prototype = {

        toastify: version,

        constructor: Toastify,

        // Initializing the object with required parameters
        init: function (options) {

            // Verifying and validating the input object
            if (!options) {
                options = {};
            }

            // Creating the options object
            this.options = {};

            // Validating the options
            this.options.text = options.text || 'Hi there!';
            this.options.duration = options.duration || 3000;
            this.options.selector = options.selector;
            this.options.callback = options.callback || function () { };

            // Returning the current object for chaining functions
            return this;
        },

        // Building the DOM element
        buildToast: function () {

            // Validating if the options are defined
            if (!this.options) {
                throw "Toastify is not initialized";
            }

            // Creating the DOM object
            var divElement = document.createElement("div");
            divElement.className = 'toastify on';

            // Adding the toast message
            divElement.innerHTML = this.options.text;

            // Callback for on-click
            divElement.addEventListener('click', this.options.callback);

            // Returning the generated element
            return divElement;
        },

        // Displaying the toast
        showToast: function () {

            // Creating the DOM object for the toast
            var toastElement = this.buildToast();

            // Getting the root element to with the toast needs to be added
            var rootElement;
            if (typeof this.options.selector == "undefined") {
                rootElement = document.body;
            } else {
                rootElement = document.getElementById(this.options.selector);
            }

            if (!rootElement) {
                throw "Root element is not defined";
            }

            // Adding the DOM element
            rootElement.insertBefore(toastElement, rootElement.firstChild);

            // Repositioning the toasts in case multiple toasts are present
            Toastify.reposition();

            window.setTimeout(function () {

                // Hiding the element
                toastElement.classList.remove("on");

                // Removing the element from DOM after transition end
                window.setTimeout(function () {

                    // Remove the elemenf from the DOM
                    toastElement.remove();

                    // Repositioning the toasts again
                    Toastify.reposition();

                }.bind(this), 400); // Binding `this` for function invocation 

            }.bind(this), this.options.duration); // Binding `this` for function invocation

            // Supporting function chaining
            return this;

        }

    }

    // Positioning the toasts on the DOM
    Toastify.reposition = function () {

        // Top margin
        var topOffsetSize = 15;

        // Get all toast messages on the DOM
        var allToasts = document.getElementsByClassName('toastify');

        // Modifying the position of each toast element
        for (var i = 0; i < allToasts.length; i++) {

            var height = allToasts[i].offsetHeight;

            // Spacing between toasts
            var offset = 15;

            // Setting the position
            allToasts[i].style.top = topOffsetSize + 'px';

            topOffsetSize += height + offset;
        }

        // Supporting function chaining
        return this;
    }

    // Setting up the prototype for the init object
    Toastify.lib.init.prototype = Toastify.lib;

    // Adding the Toastify function to the window object
    global.Toastify = Toastify;

}(window));
