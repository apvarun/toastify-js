export type Gravity = 'top' | 'bottom';
export type Position = 'left' | 'center' | 'right';
export type CloseReason = 'timeout' | 'close-button' | 'other';
const isNull = (obj: unknown): obj is null => obj === null;
const isUndefined = (obj: unknown): obj is undefined => typeof obj === 'undefined';
const isNullOrUndefined = (obj: unknown): obj is null | undefined => isUndefined(obj) || isNull(obj);
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
    onClose?: (this: Toast, e: Event) => void;
    onClick?: (this: Toast, e: Event) => void;
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
    onClose?: (this: Toast, e: Event) => void;
    onClick?: (this: Toast, e: Event) => void;
    style?: Partial<CSSStyleDeclaration>;
}

class ToastManager {
    private static timeoutMap = new Map<Toast, number>();
    private static containers = new Map<string, HTMLElement>();

    static getContainer(gravity: Gravity, position: Position): HTMLElement {
        const containerId = `toast-container-${gravity}-${position}`;
        if (this.containers.has(containerId)) {
            return this.containers.get(containerId)!;
        }
        return this.createContainer(containerId, gravity, position);
    }

    private static createContainer(id: string, gravity: Gravity, position: Position): HTMLElement {
        const container = document.createElement('div');
        container.classList.add('toast-container', id, `toast-${gravity}`, `toast-${position}`);
        container.setAttribute('role', 'region');
        document.body.appendChild(container);
        this.containers.set(id, container);
        return container;
    }

    static addTimeout(toast: Toast, callback: () => void) {
        this.delTimeout(toast);
        const timeoutId = window.setTimeout(() => {
            callback();
            this.delTimeout(toast);
        }, toast.options.duration);
        this.timeoutMap.set(toast, timeoutId);
    }

    static delTimeout(toast: Toast) {
        if (this.timeoutMap.has(toast)) {
            clearTimeout(this.timeoutMap.get(toast)!);
            this.timeoutMap.delete(toast);
        }
    }
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

    private mouseOverHandler?: () => void;
    private mouseLeaveHandler?: () => void;
    private closeButtonHandler?: () => void;
    private animationEndHandler?: (e: AnimationEvent) => void;
    private clickHandler?: (e: Event) => void;

    private content?: HTMLDivElement;
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

        this.root = ToastManager.getContainer(this.options.gravity, this.options.position);
        this.gravity = this.options.gravity;
        this.position = this.options.position;
        this.stopOnFocus = this.options.stopOnFocus;
        this.oldestFirst = this.options.oldestFirst;

        this.element = document.createElement('div');
        this.applyBaseStyles()
            .addCloseButton()
            .createContent()
            .ensureCloseMethod()
            .measureDimensions()
            .bindEvents();
    }

    private applyBaseStyles(): this {
        this.element.classList.add('toast', `toast-${this.gravity}`, `toast-${this.position}`);
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


    private measureDimensions(): this {
        const originalStyles = {
            display: this.element.style.display,
            visibility: this.element.style.visibility,
            position: this.element.style.position,
            left: this.element.style.left,
            top: this.element.style.top,
            transformOrigin: this.element.style.transformOrigin,
        };

        this.applyStyles(this.element, {
            display: 'block',
            visibility: 'hidden',
            position: 'absolute',
            left: '0',
            top: '0',
            transformOrigin: 'right bottom',
        });

        document.body.appendChild(this.element);
        const { height, width } = this.element.getBoundingClientRect();
        this.element.style.setProperty('--toast-height', `${height}px`);
        this.element.style.setProperty('--toast-width', `${width}px`);
        document.body.removeChild(this.element);

        this.applyStyles(this.element, originalStyles);
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
            this.mouseOverHandler = () => ToastManager.delTimeout(this);
            this.mouseLeaveHandler = () => ToastManager.addTimeout(this, () => this.hide('timeout'));
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
        for (const key in styles) {
            if (styles[key] === undefined) continue;
            element.style[key] = styles[key];
        }
    }

    private cutoverAnimation(animation: boolean): this {
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
            ToastManager.addTimeout(this, () => this.hide('timeout'));
        }
        return this;
    }
    /**
     * Display the Toast notification
     * @returns this Instance for method chaining
     */
    public show(): this {
        this.insertToastElement()
            .setupAutoHide()
            .cutoverAnimation(true);
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
        ToastManager.delTimeout(this);
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
            .cutoverAnimation(false);
    }

    /**
     * @deprecated This function is deprecated. Use the hide() instead.
     */
    public hideToast(): void {
        this.hide('other');
    }
}

export default function createToast(options: ToastOptions): Toast {
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
