"use strict";
(() => {
  const isNull = (obj) => obj === null;
  const isUndefined = (obj) => typeof obj === "undefined";
  const isNullOrUndefined = (obj) => isUndefined(obj) || isNull(obj);
  const activeToasts = /* @__PURE__ */ new Set();
  const toastTimeouts = /* @__PURE__ */ new Map();
  const toastIntervals = /* @__PURE__ */ new Map();
  const toastContainers = /* @__PURE__ */ new Map();
  function debounce(fn, delay, { immediate = false } = {}) {
    let timer = null;
    const debounced = function(...args) {
      const callNow = immediate && !timer;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        if (!immediate) {
          fn.apply(this, args);
        }
      }, delay);
      if (callNow) {
        fn.apply(this, args);
      }
    };
    debounced.cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    return debounced;
  }
  const getContainer = (gravity, position) => {
    const containerId = `toast-container-${gravity}-${position}`;
    if (!toastContainers.has(containerId)) {
      const container = document.createElement("div");
      container.id = containerId;
      container.classList.add(
        "toast-container",
        `toast-${gravity}`,
        `toast-${position}`
      );
      document.body.appendChild(container);
      toastContainers.set(containerId, container);
    }
    return toastContainers.get(containerId);
  };
  const addTimeout = (toast, callback) => {
    if (isNullOrUndefined(toast.progress)) return;
    if (isNullOrUndefined(toast.options.duration)) return;
    delTimeout(toast);
    const startTime = Date.now();
    const duration = toast.options.duration;
    const updateRemainingTime = () => {
      if (isNullOrUndefined(toast.progress)) return;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      toast.progress.style.setProperty("--toast-progress", `${remaining / duration}`);
    };
    toast.progress.style.setProperty("--toast-progress", `1`);
    const intervalId = window.setInterval(updateRemainingTime, 100);
    const timeoutId = window.setTimeout(() => {
      callback();
      delTimeout(toast);
    }, duration);
    toastTimeouts.set(toast, timeoutId);
    toastIntervals.set(toast, intervalId);
  };
  const delTimeout = (toast) => {
    const timeoutId = toastTimeouts.get(toast);
    const intervalId = toastIntervals.get(toast);
    if (!isNullOrUndefined(timeoutId)) {
      clearTimeout(timeoutId);
      toastTimeouts.delete(toast);
    }
    if (!isNullOrUndefined(intervalId)) {
      clearInterval(intervalId);
      toastIntervals.delete(toast);
    }
    if (!isNullOrUndefined(toast.progress)) {
      toast.progress.style.removeProperty("--toast-progress");
    }
  };
  const offscreenContainer = document.createElement("div");
  offscreenContainer.classList.add("offscreen-container");
  document.body.appendChild(offscreenContainer);
  window.addEventListener("resize", debounce(() => {
    for (const toast of activeToasts) {
      toast.setToastRect();
    }
  }, 100));
  class Toast {
    static defaults = {
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      oldestFirst: true
    };
    options;
    root;
    element;
    gravity;
    position;
    oldestFirst;
    stopOnFocus;
    content;
    progress;
    mouseOverHandler;
    mouseLeaveHandler;
    closeButtonHandler;
    animationEndHandler;
    clickHandler;
    closeButton;
    /**
     * Create a Toastify instance
     * @param options User configuration options
     */
    constructor(options) {
      this.options = {
        ...Toast.defaults,
        ...options
      };
      this.root = getContainer(this.options.gravity, this.options.position);
      this.gravity = this.options.gravity;
      this.position = this.options.position;
      this.stopOnFocus = this.options.stopOnFocus;
      this.oldestFirst = this.options.oldestFirst;
      this.element = document.createElement("div");
      this.applyBaseStyles().addCloseButton().createContent().ensureCloseMethod().bindEvents();
      activeToasts.add(this);
    }
    applyBaseStyles() {
      this.element.classList.add("toast");
      if (this.options.className) {
        const classes = Array.isArray(this.options.className) ? this.options.className : [this.options.className];
        classes.forEach((cls) => this.element.classList.add(cls));
      }
      return this;
    }
    createContent() {
      this.content = document.createElement("div");
      this.content.classList.add("toast-content");
      if (this.options.text) {
        this.content.textContent = this.options.text;
      }
      if (this.options.node) {
        this.content.appendChild(this.options.node);
      }
      if (this.options.style) {
        this.applyStyles(this.content, this.options.style);
      }
      if (!isNullOrUndefined(this.options.duration) && this.options.duration > 0) {
        this.progress = document.createElement("div");
        this.progress.classList.add("toast-progress");
        this.content.appendChild(this.progress);
      }
      this.element.appendChild(this.content);
      return this;
    }
    addCloseButton() {
      if (this.options.close) {
        this.closeButton = document.createElement("span");
        this.closeButton.className = "toast-close";
        this.closeButton.textContent = "🗙";
        this.closeButtonHandler = () => this.hide("close-button");
        this.closeButton.addEventListener("click", this.closeButtonHandler);
        this.element.appendChild(this.closeButton);
      }
      return this;
    }
    setToastRect() {
      if (!this.element.classList.contains("show")) offscreenContainer.appendChild(this.element);
      this.element.style.removeProperty("--toast-height");
      this.element.style.removeProperty("--toast-width");
      this.element.style.setProperty("max-height", "none", "important");
      this.element.style.setProperty("max-width", "none", "important");
      if (this.position == "center") this.element.style.setProperty("max-width", `${this.root.getBoundingClientRect().width}px`, "important");
      const { height, width } = this.element.getBoundingClientRect();
      this.element.style.setProperty("--toast-height", `${height}px`);
      this.element.style.setProperty("--toast-width", `${width}px`);
      this.element.style.removeProperty("max-height");
      this.element.style.removeProperty("max-width");
      if (!this.element.classList.contains("show")) offscreenContainer.removeChild(this.element);
      return this;
    }
    ensureCloseMethod() {
      if (isNullOrUndefined(this.options.duration) && isNullOrUndefined(this.options.close) && isNullOrUndefined(this.options.onClick)) {
        this.options.onClick = () => this.hide("other");
      }
      return this;
    }
    bindEvents() {
      if (this.stopOnFocus && !isNullOrUndefined(this.options.duration) && this.options.duration > 0) {
        this.mouseOverHandler = () => delTimeout(this);
        this.mouseLeaveHandler = () => addTimeout(this, () => this.hide("timeout"));
        this.element.addEventListener("mouseover", this.mouseOverHandler);
        this.element.addEventListener("mouseleave", this.mouseLeaveHandler);
      }
      if (!isNullOrUndefined(this.options.onClick)) {
        this.clickHandler = this.options.onClick.bind(this);
        this.element.addEventListener("click", this.clickHandler);
      }
      return this;
    }
    applyStyles(element, styles) {
      function camelToKebab(str) {
        return str.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
      for (const key in styles) {
        const value = styles[key];
        const property = camelToKebab(key);
        if (isNullOrUndefined(value)) {
          element.style.removeProperty(property);
          continue;
        }
        const important = value.includes("!important");
        const cleanValue = value.replace(/\s*!important\s*/, "").trim();
        element.style.setProperty(property, cleanValue, important ? "important" : "");
      }
    }
    toggleAnimationState(animation) {
      if (!this.element.classList.replace(animation ? "hide" : "show", animation ? "show" : "hide")) {
        this.element.classList.add(animation ? "show" : "hide");
      }
      return this;
    }
    insertToastElement() {
      if (this.oldestFirst) {
        this.root.insertBefore(this.element, this.root.firstChild);
      } else {
        if (this.root.lastChild) {
          this.root.insertBefore(this.element, this.root.lastChild.nextSibling);
        } else {
          this.root.appendChild(this.element);
        }
      }
      return this;
    }
    setupAutoHide() {
      if (!isNullOrUndefined(this.options.duration) && this.options.duration > 0) {
        addTimeout(this, () => this.hide("timeout"));
      }
      return this;
    }
    /**
     * Display the Toast notification
     * @returns this Instance for method chaining
     */
    show() {
      this.setToastRect().insertToastElement().toggleAnimationState(true).setupAutoHide();
      return this;
    }
    /**
     * @deprecated This function is deprecated. Use the show() instead.
     */
    showToast() {
      return this.show();
    }
    removeEventListeners() {
      if (this.mouseOverHandler) {
        this.element.removeEventListener("mouseover", this.mouseOverHandler);
      }
      if (this.mouseLeaveHandler) {
        this.element.removeEventListener("mouseleave", this.mouseLeaveHandler);
      }
      if (this.clickHandler) {
        this.element.removeEventListener("click", this.clickHandler);
      }
      if (this.options.close && this.closeButton && this.closeButtonHandler) {
        this.closeButton.removeEventListener("click", this.closeButtonHandler);
      }
      return this;
    }
    /**
     * Hide the current Toast with optional close reason
     * @param reason The reason for closing (default: 'other')
     * Triggers a CSS exit animation and removes the element after the animation completes
     */
    hide(reason = "other") {
      if (!this.element) return;
      delTimeout(this);
      activeToasts.delete(this);
      this.animationEndHandler = (e) => {
        if (e.animationName.startsWith("toast-out")) {
          this.element.removeEventListener("animationend", this.animationEndHandler);
          this.element.remove();
          this.options.onClose?.call(this, new CustomEvent("toast-close", {
            detail: { reason }
          }));
        }
      };
      this.element.addEventListener("animationend", this.animationEndHandler);
      this.removeEventListeners().toggleAnimationState(false);
    }
    /**
     * @deprecated This function is deprecated. Use the hide() instead.
     */
    hideToast() {
      this.hide("other");
    }
  }
  function createToast(options) {
    return new Toast(options);
  }
  globalThis.Toast = createToast;
  globalThis.Toastify = createToast;
})();
//# sourceMappingURL=toastify.js.map
