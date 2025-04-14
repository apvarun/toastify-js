export type Gravity = 'top' | 'bottom';
export type Position = 'left' | 'center' | 'right';
export type CloseReason = 'timeout' | 'close-button' | 'other';
type DebounceOptions = {
    immediate?: boolean
}
const isNull = (obj: unknown): obj is null => obj === null;
const isUndefined = (obj: unknown): obj is undefined => typeof obj === 'undefined';
const isNullOrUndefined = (obj: unknown): obj is null | undefined => isUndefined(obj) || isNull(obj);
const activeToasts = new Set<Toast>();
const toastTimeouts = new Map<Toast, number>();
const toastIntervals = new Map<Toast, number>();
const toastContainers = new Map<string, HTMLElement>();
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    { immediate = false }: DebounceOptions = {}
) {
    let timer: ReturnType<typeof setTimeout> | null = null
    const debounced = function (this: any, ...args: Parameters<T>) {
        const callNow = immediate && !timer
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            timer = null
            if (!immediate) {
                fn.apply(this, args)
            }
        }, delay)
        if (callNow) {
            fn.apply(this, args)
        }
    } as T & { cancel: () => void }
    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }
    return debounced
}
const getContainer = (gravity: Gravity, position: Position): HTMLElement => {
    const containerId = `toast-container-${gravity}-${position}`;
    if (!toastContainers.has(containerId)) {
        const container = document.createElement('div');
        container.id = containerId;
        container.classList.add(
            'toast-container',
            `toast-${gravity}`,
            `toast-${position}`
        );
        document.body.appendChild(container);
        toastContainers.set(containerId, container);
    }
    return toastContainers.get(containerId)!;
};
const addTimeout = (toast: Toast, callback: () => void): void => {
    if (isNullOrUndefined(toast.progress)) return;
    if (isNullOrUndefined(toast.options.duration)) return;
    delTimeout(toast);
    const startTime = Date.now();
    const duration = toast.options.duration;
    const updateRemainingTime = () => {
        if (isNullOrUndefined(toast.progress)) return;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        toast.progress.style.setProperty('--toast-progress', `${remaining / duration}`);
    };
    toast.progress.style.setProperty('--toast-progress', `1`);
    const intervalId = window.setInterval(updateRemainingTime, 100);
    const timeoutId = window.setTimeout(() => {
        callback();
        delTimeout(toast);
    }, duration);
    toastTimeouts.set(toast, timeoutId);
    toastIntervals.set(toast, intervalId);
};
const delTimeout = (toast: Toast): void => {
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
    if (!isNullOrUndefined(toast.progress)){
        toast.progress.style.removeProperty('--toast-progress');
    }
};
const offscreenContainer = document.createElement('div');
offscreenContainer.classList.add('offscreen-container');
document.body.appendChild(offscreenContainer);

window.addEventListener('resize', debounce(() => {
    for (const toast of activeToasts) {
        toast.setToastRect();
    }
}, 100));
export interface ToastOptions {
    root?: Element;
    text?: string;
    node?: Node;
    duration?: number;
    close?: boolean;
    gravity?: Gravity;
    position?: Position;
    className?: string | string[];
    stopOnFocus?: boolean;
    onClose?: (this: Toast, e: CustomEvent<{ reason: CloseReason }>) => void;
    onClick?: (this: Toast, e: MouseEvent) => void;
    style?: Partial<CSSStyleDeclaration>;
    oldestFirst?: boolean;
}
interface Options {
    gravity: Gravity;
    position: Position;
    stopOnFocus: boolean;
    oldestFirst: boolean;
    text?: string;
    node?: Node;
    duration?: number;
    close?: boolean;
    className?: string | string[];
    onClose?: (this: Toast, e: CustomEvent<{ reason: CloseReason }>) => void;
    onClick?: (this: Toast, e: MouseEvent) => void;
    style?: Partial<CSSStyleDeclaration>;
}
/**
 * Toast
 * @example
 * new Toast({ text: 'Hello World' }).show();
 */
export class Toast {
    private static readonly defaults: Options = {
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
        oldestFirst: true,
    };
    public options: Options;
    public root: Element;
    public element: HTMLElement;

    public gravity: Gravity;
    public position: Position;
    public oldestFirst: boolean;
    public stopOnFocus: boolean;
    public content?: HTMLDivElement;
    public progress?: HTMLDivElement;

    private mouseOverHandler?: () => void;
    private mouseLeaveHandler?: () => void;
    private closeButtonHandler?: () => void;
    private animationEndHandler?: (e: AnimationEvent) => void;
    private clickHandler?: (e: MouseEvent) => void;

    private closeButton?: HTMLSpanElement;

    /**
     * Create a Toastify instance
     * @param options User configuration options
     */
    constructor(options: ToastOptions) {
        this.options = {
            ...Toast.defaults,
            ...options
        };

        this.root = getContainer(this.options.gravity, this.options.position);
        this.gravity = this.options.gravity;
        this.position = this.options.position;
        this.stopOnFocus = this.options.stopOnFocus;
        this.oldestFirst = this.options.oldestFirst;

        this.element = document.createElement('div');
        this.applyBaseStyles()
            .addCloseButton()
            .createContent()
            .ensureCloseMethod()
            .bindEvents();

        activeToasts.add(this);
    }

    private applyBaseStyles(): this {
        this.element.classList.add('toast');
        if (this.options.className) {
            const classes = Array.isArray(this.options.className)
                ? this.options.className
                : [this.options.className];
            classes.forEach(cls => this.element.classList.add(cls));
        }
        return this;
    }

    private createContent(): this {
        this.content = document.createElement('div');
        this.content.classList.add('toast-content');

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
            this.progress = document.createElement('div');
            this.progress.classList.add('toast-progress');
            this.content.appendChild(this.progress);
        }

        this.element.appendChild(this.content);
        return this;
    }

    private addCloseButton(): this {
        if (this.options.close) {
            this.closeButton = document.createElement('span');
            this.closeButton.className = 'toast-close';
            this.closeButton.textContent = '🗙';
            this.closeButtonHandler = () => this.hide('close-button');
            this.closeButton.addEventListener('click', this.closeButtonHandler);
            this.element.appendChild(this.closeButton);
        }
        return this;
    }

    public setToastRect(): this {
        // fix max-height cannot be automatically animated
        if (!this.element.classList.contains('show')) offscreenContainer.appendChild(this.element);
        this.element.style.removeProperty('--toast-height');
        this.element.style.removeProperty('--toast-width');
        this.element.style.setProperty('max-height', 'none', 'important');
        this.element.style.setProperty('max-width', 'none', 'important');
        if (this.position == 'center') this.element.style.setProperty('max-width', `${this.root.getBoundingClientRect().width}px`, 'important');
        const { height, width } = this.element.getBoundingClientRect();
        this.element.style.setProperty('--toast-height', `${height}px`);
        this.element.style.setProperty('--toast-width', `${width}px`);
        this.element.style.removeProperty('max-height');
        this.element.style.removeProperty('max-width');
        if (!this.element.classList.contains('show')) offscreenContainer.removeChild(this.element);
        return this;
    }
    private ensureCloseMethod(): this {
        if (isNullOrUndefined(this.options.duration) && isNullOrUndefined(this.options.close) && isNullOrUndefined(this.options.onClick)) {
            this.options.onClick = () => this.hide('other');
        }
        return this;
    }

    private bindEvents(): this {
        if (this.stopOnFocus && !isNullOrUndefined(this.options.duration) && this.options.duration > 0) {
            this.mouseOverHandler = () => delTimeout(this);
            this.mouseLeaveHandler = () => addTimeout(this, () => this.hide('timeout'));
            this.element.addEventListener('mouseover', this.mouseOverHandler);
            this.element.addEventListener('mouseleave', this.mouseLeaveHandler);
        }
        if (!isNullOrUndefined(this.options.onClick)) {
            this.clickHandler = this.options.onClick.bind(this);
            this.element.addEventListener('click', this.clickHandler);
        }
        return this;
    }

    private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
        function camelToKebab(str: string): string {
            return str.replace(/([A-Z])/g, '-$1').toLowerCase();
        }
        for (const key in styles) {
            const value = styles[key];
            const property = camelToKebab(key);
            if (isNullOrUndefined(value)) {
                element.style.removeProperty(property);
                continue;
            }
            const important = value.includes('!important');
            const cleanValue = value.replace(/\s*!important\s*/, '').trim();
            element.style.setProperty(property, cleanValue, important ? 'important' : '');
        }
    }

    private toggleAnimationState(animation: boolean): this {
        if (!this.element.classList.replace(animation ? 'hide' : 'show', animation ? 'show' : 'hide')) {
            this.element.classList.add(animation ? 'show' : 'hide');
        }
        return this;
    }

    private insertToastElement(): this {
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

    private setupAutoHide(): this {
        if (!isNullOrUndefined(this.options.duration) && this.options.duration > 0) {
            addTimeout(this, () => this.hide('timeout'));
        }
        return this;
    }
    /**
     * Display the Toast notification
     * @returns this Instance for method chaining
     */
    public show(): this {
        this.setToastRect()
            .insertToastElement()
            .toggleAnimationState(true)
            .setupAutoHide();
        return this;
    }

    /**
     * @deprecated This function is deprecated. Use the show() instead.
     */
    public showToast() {
        return this.show();
    }

    private removeEventListeners(): this {
        if (this.mouseOverHandler) {
            this.element.removeEventListener('mouseover', this.mouseOverHandler);
        }
        if (this.mouseLeaveHandler) {
            this.element.removeEventListener('mouseleave', this.mouseLeaveHandler);
        }
        if (this.clickHandler) {
            this.element.removeEventListener('click', this.clickHandler);
        }
        if (this.options.close && this.closeButton && this.closeButtonHandler) {
            this.closeButton.removeEventListener('click', this.closeButtonHandler);
        }
        return this;
    }

    /**
     * Hide the current Toast with optional close reason
     * @param reason The reason for closing (default: 'other')
     * Triggers a CSS exit animation and removes the element after the animation completes
     */
    public hide(reason: CloseReason = 'other'): void {
        if (!this.element) return;
        delTimeout(this);
        activeToasts.delete(this);
        this.animationEndHandler = (e: AnimationEvent) => {
            if (e.animationName.startsWith('toast-out')) {
                this.element.removeEventListener('animationend', this.animationEndHandler!);
                this.element.remove();
                this.options.onClose?.call(this, new CustomEvent('toast-close', {
                    detail: { reason }
                }));
            }
        };
        this.element.addEventListener('animationend', this.animationEndHandler);
        this.removeEventListeners()
            .toggleAnimationState(false);
    }

    /**
     * @deprecated This function is deprecated. Use the hide() instead.
     */
    public hideToast(): void {
        this.hide('other');
    }
}

function createToast(options: ToastOptions): Toast {
    return new Toast(options);
}

declare global {
    function Toast(options: ToastOptions): Toast;
    /**
     * @deprecated This function is deprecated. Use the Toast() instead.
     */
    function Toastify(options: ToastOptions): Toast;
}

globalThis.Toast = createToast;
globalThis.Toastify = createToast;
