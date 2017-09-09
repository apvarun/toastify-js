/*!
 * Toastify js 0.0.6
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2017 Varun A P
 */
; (function (global) {

    // Object initialization
    var Toastify = function (options) {

        // Returning a new init object
        return new Toastify.lib.init(options);
    },
        // Library version
        version = "0.0.5";

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
            this.options.text = options.text || 'Hi there!'; // Display message
            this.options.duration = options.duration || 3000; // Display duration
            this.options.selector = options.selector; // Parent selector
            this.options.callback = options.callback || function () { }; // Callback after display
            this.options.destination = options.destination; // On-click destination
            this.options.newWindow = options.newWindow || false; // Open destination in new window
            this.options.close = options.close || false; // Show toast close icon
            this.options.gravity = (options.gravity == "bottom") ? "bottom" : "top"; // toast position - top or bottom
            this.options.positionLeft = options.positionLeft || false; // toast position - left or right
            this.options.backgroundColor = options.backgroundColor || "linear-gradient(135deg, #73a5ff, #5477f5)"; // toast position - left or right

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

            // Positioning toast to left or right
            if (this.options.positionLeft === true) {
                divElement.className += " left";
            } else {
                divElement.className += " right";
            }

            // Assigning gravity of element
            divElement.className += " " + this.options.gravity;

            divElement.style.background = this.options.backgroundColor;

            // Adding the toast message
            divElement.innerHTML = this.options.text;

            // Adding a close icon to the toast
            if (this.options.close === true) {

                // Create a span for close element
                var closeElement = document.createElement("span");
                closeElement.innerHTML = "&#10006;";

                closeElement.className = 'toast-close';

                // Triggering the removal of toast from DOM on close click
                closeElement.addEventListener('click', function (event) {

                    this.removeElement(event.target.parentElement);

                }.bind(this));

                //Calculating screen width
                var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

                // Adding the close icon to the toast element
                // Display on the right if screen width is less than or equal to 360px
                if (this.options.positionLeft === true && width > 360) {

                    // Adding close icon on the left of content
                    divElement.prepend(closeElement);

                } else {

                    // Adding close icon on the right of content
                    divElement.appendChild(closeElement);

                }

            }

            // Adding an on-click destination path
            if (typeof this.options.destination !== 'undefined') {

                // Setting up an anchor object
                var linkElement = document.createElement("a");
                linkElement.setAttribute("href", this.options.destination);

                if (this.options.newWindow === true) {
                    linkElement.setAttribute("target", "_blank");
                }

                // Rectifying class names due to nesting
                divElement.className = '';
                linkElement.className = 'toastify on';

                // Positioning toast to left or right
                if (this.options.positionLeft === true) {
                    linkElement.className += " left";
                } else {
                    linkElement.className += " right";
                }

                // Assigning gravity of element
                linkElement.className += " " + this.options.gravity;

                divElement.style.background = "";
                linkElement.style.background = this.options.backgroundColor;

                // Adding the text element inside link
                linkElement.appendChild(divElement);

                // Returning the linked element
                return linkElement;

            }

            // Returning the generated element
            return divElement;
        },

        // Displaying the toast
        showToast: function () {

            // Creating the DOM object for the toast
            var toastElement = this.buildToast();

            // Getting the root element to with the toast needs to be added
            var rootElement;
            if (typeof this.options.selector === "undefined") {
                rootElement = document.body;
            } else {
                rootElement = document.getElementById(this.options.selector);
            }

            // Validating if root element is present in DOM
            if (!rootElement) {
                throw "Root element is not defined";
            }

            // Adding the DOM element
            rootElement.insertBefore(toastElement, rootElement.firstChild);

            // Repositioning the toasts in case multiple toasts are present
            Toastify.reposition();

            window.setTimeout(function () {

                // Remove the toast from DOM
                this.removeElement(toastElement);

            }.bind(this), this.options.duration); // Binding `this` for function invocation

            // Supporting function chaining
            return this;

        },

        // Removing the element from the DOM
        removeElement: function (toastElement) {

            // Hiding the element
            toastElement.classList.remove("on");

            // Removing the element from DOM after transition end
            window.setTimeout(function () {

                // Remove the elemenf from the DOM
                toastElement.remove();

                // Calling the callback function
                this.options.callback.call(toastElement);

                // Repositioning the toasts again
                Toastify.reposition();

            }.bind(this), 400); // Binding `this` for function invocation 

        }

    }

    // Positioning the toasts on the DOM
    Toastify.reposition = function () {

        // Top margins with gravity
        var topLeftOffsetSize = {
            top: 15,
            bottom: 15
        };
        var topRightOffsetSize = {
            top: 15,
            bottom: 15
        };
        var offsetSize = {
            top: 15,
            bottom: 15
        };

        // Get all toast messages on the DOM
        var allToasts = document.getElementsByClassName('toastify');

        var classUsed;

        // Modifying the position of each toast element
        for (var i = 0; i < allToasts.length; i++) {

            // Getting the applied gravity
            if (allToasts[i].classList.contains('top') === true) {
                classUsed = "top";
            } else {
                classUsed = "bottom";
            }

            var height = allToasts[i].offsetHeight;

            // Spacing between toasts
            var offset = 15;

            var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

            // Show toast in center if screen with less than or qual to 360px
            if (width <= 360) {

                // Setting the position
                allToasts[i].style[classUsed] = offsetSize[classUsed] + 'px';

                offsetSize[classUsed] += height + offset;

            } else {

                if (allToasts[i].classList.contains('left') === true) {

                    // Setting the position
                    allToasts[i].style[classUsed] = topLeftOffsetSize[classUsed] + 'px';

                    topLeftOffsetSize[classUsed] += height + offset;

                } else {

                    // Setting the position
                    allToasts[i].style[classUsed] = topRightOffsetSize[classUsed] + 'px';

                    topRightOffsetSize[classUsed] += height + offset;

                }

            }
        }

        // Supporting function chaining
        return this;
    }

    // Setting up the prototype for the init object
    Toastify.lib.init.prototype = Toastify.lib;

    // Adding the Toastify function to the window object
    global.Toastify = Toastify;

}(window));
