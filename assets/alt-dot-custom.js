/**
 * This uncompressed file is not referenced by the theme,
 * it is only included as a reference.
 *
 * If you need help with our code, contact us:
 * team@altanddot.com
 */
// Same as https://github.com/edenspiekermann/a11y-dialog
// Except a single change to lines 182 to ignore other dialogs.
/* global NodeList, Element, Event, define */

(function (global) {
  "use strict";

  var FOCUSABLE_ELEMENTS = [
    'a[href]:not([tabindex^="-"]):not([inert])',
    'area[href]:not([tabindex^="-"]):not([inert])',
    "input:not([disabled]):not([inert])",
    "select:not([disabled]):not([inert])",
    "textarea:not([disabled]):not([inert])",
    "button:not([disabled]):not([inert])",
    'iframe:not([tabindex^="-"]):not([inert])',
    'audio:not([tabindex^="-"]):not([inert])',
    'video:not([tabindex^="-"]):not([inert])',
    '[contenteditable]:not([tabindex^="-"]):not([inert])',
    '[tabindex]:not([tabindex^="-"]):not([inert])',
  ];
  var TAB_KEY = 9;
  var ESCAPE_KEY = 27;
  var focusedBeforeDialog;

  /**
   * Define the constructor to instantiate a dialog
   *
   * @constructor
   * @param {Element} node
   * @param {(NodeList | Element | string)} targets
   */
  function A11yDialog(node, targets) {
    // Prebind the functions that will be bound in addEventListener and
    // removeEventListener to avoid losing references
    this._show = this.show.bind(this);
    this._hide = this.hide.bind(this);
    this._maintainFocus = this._maintainFocus.bind(this);
    this._bindKeypress = this._bindKeypress.bind(this);

    // Keep a reference of the node and the actual dialog on the instance
    this.container = node;
    this.dialog = node.querySelector(
      'dialog, [role="dialog"], [role="alertdialog"]'
    );
    this.role = this.dialog.getAttribute("role") || "dialog";
    this.useDialog =
      "show" in document.createElement("dialog") &&
      this.dialog.nodeName === "DIALOG";

    // Keep an object of listener types mapped to callback functions
    this._listeners = {};

    // Initialise everything needed for the dialog to work properly
    this.create(targets);
  }

  /**
   * Set up everything necessary for the dialog to be functioning
   *
   * @param {(NodeList | Element | string)} targets
   * @return {this}
   */
  A11yDialog.prototype.create = function (targets) {
    // Keep a collection of nodes to disable/enable when toggling the dialog
    this._targets =
      this._targets || collect(targets) || getSiblings(this.container);

    // Set the `shown` property to match the status from the DOM
    this.shown = this.dialog.hasAttribute("open");

    // Despite using a `<dialog>` element, `role="dialog"` is not necessarily
    // implied by all screen-readers (yet)
    // See: https://github.com/edenspiekermann/a11y-dialog/commit/6ba711a777aed0dbda0719a18a02f742098c64d9#commitcomment-28694166
    this.dialog.setAttribute("role", this.role);

    if (!this.useDialog) {
      if (this.shown) {
        this.container.removeAttribute("aria-hidden");
      } else {
        this.container.setAttribute("aria-hidden", true);
      }
    } else {
      this.container.setAttribute("data-a11y-dialog-native", "");
    }

    // Keep a collection of dialog openers, each of which will be bound a click
    // event listener to open the dialog
    this._openers = $$('[data-a11y-dialog-show="' + this.container.id + '"]');
    this._openers.forEach(
      function (opener) {
        opener.addEventListener("click", this._show);
      }.bind(this)
    );

    // Keep a collection of dialog closers, each of which will be bound a click
    // event listener to close the dialog
    this._closers = $$("[data-a11y-dialog-hide]", this.container).concat(
      $$('[data-a11y-dialog-hide="' + this.container.id + '"]')
    );
    this._closers.forEach(
      function (closer) {
        closer.addEventListener("click", this._hide);
      }.bind(this)
    );

    // Execute all callbacks registered for the `create` event
    this._fire("create");

    return this;
  };

  /**
   * Show the dialog element, disable all the targets (siblings), trap the
   * current focus within it, listen for some specific key presses and fire all
   * registered callbacks for `show` event
   *
   * @param {Event} event
   * @return {this}
   */
  A11yDialog.prototype.show = function (event) {
    // If the dialog is already open, abort
    if (this.shown) {
      return this;
    }

    this.shown = true;

    // Keep a reference to the currently focused element to be able to restore
    // it later
    focusedBeforeDialog = document.activeElement;

    if (this.useDialog) {
      this.dialog.showModal(event instanceof Event ? void 0 : event);
    } else {
      this.dialog.setAttribute("open", "");
      this.container.removeAttribute("aria-hidden");

      // Iterate over the targets to disable them by setting their `aria-hidden`
      // attribute to `true`
      this._targets.forEach(function (target) {
        target.setAttribute("aria-hidden", "true");
      });
    }

    // Set the focus to the first focusable child of the dialog element
    setFocusToFirstItem(this.dialog);

    // Bind a focus event listener to the body element to make sure the focus
    // stays trapped inside the dialog while open, and start listening for some
    // specific key presses (TAB and ESC)
    document.body.addEventListener("focus", this._maintainFocus, true);
    document.addEventListener("keydown", this._bindKeypress);

    // Execute all callbacks registered for the `show` event
    this._fire("show", event);

    return this;
  };

  /**
   * Hide the dialog element, enable all the targets (siblings), restore the
   * focus to the previously active element, stop listening for some specific
   * key presses and fire all registered callbacks for `hide` event
   *
   * @param {Event} event
   * @return {this}
   */
  A11yDialog.prototype.hide = function (event) {
    // If the dialog is already closed, abort
    if (!this.shown) {
      return this;
    }

    this.shown = false;

    if (this.useDialog) {
      this.dialog.close(event instanceof Event ? void 0 : event);
    } else {
      this.dialog.removeAttribute("open");
      this.container.setAttribute("aria-hidden", "true");

      // Iterate over the targets to enable them by removing their `aria-hidden`
      // attribute
      this._targets.forEach(function (target) {
        if (!target.hasAttribute("data-dialog")) {
          target.removeAttribute("aria-hidden");
        }
      });
    }

    // If there was a focused element before the dialog was opened (and it has a
    // `focus` method), restore the focus back to it
    // See: https://github.com/edenspiekermann/a11y-dialog/issues/108
    if (focusedBeforeDialog && focusedBeforeDialog.focus) {
      focusedBeforeDialog.focus();
    }

    // Remove the focus event listener to the body element and stop listening
    // for specific key presses
    document.body.removeEventListener("focus", this._maintainFocus, true);
    document.removeEventListener("keydown", this._bindKeypress);

    // Execute all callbacks registered for the `hide` event
    this._fire("hide", event);

    return this;
  };

  /**
   * Destroy the current instance (after making sure the dialog has been hidden)
   * and remove all associated listeners from dialog openers and closers
   *
   * @return {this}
   */
  A11yDialog.prototype.destroy = function () {
    // Hide the dialog to avoid destroying an open instance
    this.hide();

    // Remove the click event listener from all dialog openers
    this._openers.forEach(
      function (opener) {
        opener.removeEventListener("click", this._show);
      }.bind(this)
    );

    // Remove the click event listener from all dialog closers
    this._closers.forEach(
      function (closer) {
        closer.removeEventListener("click", this._hide);
      }.bind(this)
    );

    // Execute all callbacks registered for the `destroy` event
    this._fire("destroy");

    // Keep an object of listener types mapped to callback functions
    this._listeners = {};

    return this;
  };

  /**
   * Register a new callback for the given event type
   *
   * @param {string} type
   * @param {Function} handler
   */
  A11yDialog.prototype.on = function (type, handler) {
    if (typeof this._listeners[type] === "undefined") {
      this._listeners[type] = [];
    }

    this._listeners[type].push(handler);

    return this;
  };

  /**
   * Unregister an existing callback for the given event type
   *
   * @param {string} type
   * @param {Function} handler
   */
  A11yDialog.prototype.off = function (type, handler) {
    var index = this._listeners[type].indexOf(handler);

    if (index > -1) {
      this._listeners[type].splice(index, 1);
    }

    return this;
  };

  /**
   * Iterate over all registered handlers for given type and call them all with
   * the dialog element as first argument, event as second argument (if any).
   *
   * @access private
   * @param {string} type
   * @param {Event} event
   */
  A11yDialog.prototype._fire = function (type, event) {
    var listeners = this._listeners[type] || [];

    listeners.forEach(
      function (listener) {
        listener(this.container, event);
      }.bind(this)
    );
  };

  /**
   * Private event handler used when listening to some specific key presses
   * (namely ESCAPE and TAB)
   *
   * @access private
   * @param {Event} event
   */
  A11yDialog.prototype._bindKeypress = function (event) {
    // If the dialog is shown and the ESCAPE key is being pressed, prevent any
    // further effects from the ESCAPE key and hide the dialog, unless its role
    // is 'alertdialog', which should be modal
    if (
      this.shown &&
      event.which === ESCAPE_KEY &&
      this.role !== "alertdialog"
    ) {
      event.preventDefault();
      this.hide(event);
    }

    // If the dialog is shown and the TAB key is being pressed, make sure the
    // focus stays trapped within the dialog element
    if (this.shown && event.which === TAB_KEY) {
      trapTabKey(this.dialog, event);
    }
  };

  /**
   * Private event handler used when making sure the focus stays within the
   * currently open dialog
   *
   * @access private
   * @param {Event} event
   */
  A11yDialog.prototype._maintainFocus = function (event) {
    // If the dialog is shown and the focus is not within the dialog element,
    // move it back to its first focusable child
    if (this.shown && !this.container.contains(event.target)) {
      setFocusToFirstItem(this.dialog);
    }
  };

  /**
   * Convert a NodeList into an array
   *
   * @param {NodeList} collection
   * @return {Array<Element>}
   */
  function toArray(collection) {
    return Array.prototype.slice.call(collection);
  }

  /**
   * Query the DOM for nodes matching the given selector, scoped to context (or
   * the whole document)
   *
   * @param {String} selector
   * @param {Element} [context = document]
   * @return {Array<Element>}
   */
  function $$(selector, context) {
    return toArray((context || document).querySelectorAll(selector));
  }

  /**
   * Return an array of Element based on given argument (NodeList, Element or
   * string representing a selector)
   *
   * @param {(NodeList | Element | string)} target
   * @return {Array<Element>}
   */
  function collect(target) {
    if (NodeList.prototype.isPrototypeOf(target)) {
      return toArray(target);
    }

    if (Element.prototype.isPrototypeOf(target)) {
      return [target];
    }

    if (typeof target === "string") {
      return $$(target);
    }
  }

  /**
   * Set the focus to the first element with `autofocus` or the first focusable
   * child of the given element
   *
   * @param {Element} node
   */
  function setFocusToFirstItem(node) {
    var focusableChildren = getFocusableChildren(node);
    var focused = node.querySelector("[autofocus]") || focusableChildren[0];

    if (focused) {
      focused.focus();
    }
  }

  /**
   * Get the focusable children of the given element
   *
   * @param {Element} node
   * @return {Array<Element>}
   */
  function getFocusableChildren(node) {
    return $$(FOCUSABLE_ELEMENTS.join(","), node).filter(function (child) {
      return !!(
        child.offsetWidth ||
        child.offsetHeight ||
        child.getClientRects().length
      );
    });
  }

  /**
   * Trap the focus inside the given element
   *
   * @param {Element} node
   * @param {Event} event
   */
  function trapTabKey(node, event) {
    var focusableChildren = getFocusableChildren(node);
    var focusedItemIndex = focusableChildren.indexOf(document.activeElement);

    // If the SHIFT key is being pressed while tabbing (moving backwards) and
    // the currently focused item is the first one, move the focus to the last
    // focusable item from the dialog element
    if (event.shiftKey && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
      // If the SHIFT key is not being pressed (moving forwards) and the currently
      // focused item is the last one, move the focus to the first focusable item
      // from the dialog element
    } else if (
      !event.shiftKey &&
      focusedItemIndex === focusableChildren.length - 1
    ) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }

  /**
   * Retrieve siblings from given element
   *
   * @param {Element} node
   * @return {Array<Element>}
   */
  function getSiblings(node) {
    var nodes = toArray(node.parentNode.childNodes);
    var siblings = nodes.filter(function (node) {
      return node.nodeType === 1;
    });

    siblings.splice(siblings.indexOf(node), 1);

    return siblings;
  }

  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = A11yDialog;
  } else if (typeof define === "function" && define.amd) {
    define("A11yDialog", [], function () {
      return A11yDialog;
    });
  } else if (typeof global === "object") {
    global.A11yDialog = A11yDialog;
  }
})(typeof global !== "undefined" ? global : window);

import { isInViewport } from "./helpers";
import { focusable } from "@shopify/theme-a11y";

// A wrapper for fixing some minor a11y issues in tiny slider library.

export function a11yTinySlider(slideshow, speed) {
  const initialInfo = slideshow.getInfo();

  init();

  function init() {
    fixControls();
    fixDots();
    fixTabbing(initialInfo);

    slideshow.events.on("transitionEnd", function () {
      recalculate(slideshow.getInfo());
    });

    slideshow.events.on("newBreakpointEnd", function () {
      recalculate(slideshow.getInfo());
    });
  }

  function fixControls() {
    // Correct the focus on the arrows
    const info = slideshow.getInfo();
    if (info.hasControls) {
      info.controlsContainer.setAttribute("tabindex", -1);
      info.nextButton.setAttribute("tabindex", 0);
      info.prevButton.setAttribute("tabindex", 0);
    }
  }

  function fixDots() {
    // Move focus after dots are clicked
    const info = slideshow.getInfo();

    if (info.navItems) {
      [].forEach.call(info.navItems, function (navItem) {
        // Restore tab on dots
        navItem.setAttribute("tabindex", 0);
        navItem.addEventListener("click", () => {
          slideshow.events.on("transitionEnd", focusSlide);
        });
      });
    }
  }

  function fixTabbing(info) {
    const allSlides = info.slideItems;

    if (info.pages == 1) {
      // Only one page, everything should be accessible.
      Object.keys(allSlides).forEach(function (index) {
        if (allSlides[index].classList.contains("tns-slide-active")) {
          allSlides[index].removeAttribute("aria-hidden");
          allSlides[index].removeAttribute("tabindex");

          const focusableElements = focusable(allSlides[index]);
          [].forEach.call(focusableElements, (item) => {
            item.removeAttribute("tabindex");
          });
        }
      });
    } else {
      // Multiple pages.
      // Loop through every slide. On hidden slides, tab index of all focusable elements should be -1
      Object.keys(allSlides).forEach(function (index) {
        let tabIndex = 0;
        if (allSlides[index].hasAttribute("aria-hidden")) {
          tabIndex = -1;
        }

        const focusableElements = focusable(allSlides[index]);

        [].forEach.call(focusableElements, (item) => {
          // Some slides may be partially viewable, but elements on these should not be interactable unless they are fully in frame.
          if (!isInViewport(allSlides[index])) {
            tabIndex = -1;
          }

          item.setAttribute("tabindex", tabIndex);
        });
      });
    }
  }

  function focusSlide() {
    // Focus on the slide or the desired element within the slide once the animation is run
    const slide = initialInfo.container.querySelector(".tns-slide-active");
    const toFocus = slide.querySelector("[data-focus]");
    if (toFocus) {
      slide.setAttribute("tabindex", 0);
      toFocus.focus();
    } else {
      slide.setAttribute("tabindex", -1);
      slide.focus({
        preventScroll: true,
      });
    }

    slideshow.events.off("transitionEnd", focusSlide);
  }

  function recalculate(info) {
    if (info.navItems) {
      [].forEach.call(info.navItems, function (navItem) {
        navItem.setAttribute("tabindex", 0);
      });
    }

    // Wait for animation to finish then fix tabindex
    setTimeout(function () {
      fixTabbing(info);
    }, speed);
  }
}

// This is a copy of Shopify's accessible link script found in their theme-a11y package.
// The only difference is that the elements are looped over using an Array prototype.call function as looping over a NodeList is not supported in IE11.
export function accessibleLinks(elements, options) {
  if (typeof elements !== "string") {
    throw new TypeError(elements + " is not a String.");
  }

  elements = document.querySelectorAll(elements);

  if (elements.length === 0) {
    return;
  }

  options = options || {};
  options.messages = options.messages || {};

  var messages = {
    newWindow: options.messages.newWindow || "Opens in a new window.",
    external: options.messages.external || "Opens external website.",
    newWindowExternal:
      options.messages.newWindowExternal ||
      "Opens external website in a new window.",
  };

  var prefix = options.prefix || "a11y";

  var messageSelectors = {
    newWindow: prefix + "-new-window-message",
    external: prefix + "-external-message",
    newWindowExternal: prefix + "-new-window-external-message",
  };

  function generateHTML(messages) {
    var container = document.createElement("ul");
    var htmlMessages = Object.keys(messages).reduce(function (html, key) {
      return (html +=
        "<li id=" + messageSelectors[key] + ">" + messages[key] + "</li>");
    }, "");

    container.setAttribute("hidden", true);
    container.innerHTML = htmlMessages;

    document.body.appendChild(container);
  }

  function externalSite(link) {
    return link.hostname !== window.location.hostname;
  }

  Array.prototype.forEach.call(elements, function (link) {
    var target = link.getAttribute("target");
    var rel = link.getAttribute("rel");
    var isExternal = externalSite(link);
    var isTargetBlank = target === "_blank";
    var isRelNoopenerEmpty = rel === null || rel.indexOf("noopener") === -1;

    if (isTargetBlank && isRelNoopenerEmpty) {
      link.setAttribute("rel", "noopener");
    }

    if (isExternal && isTargetBlank) {
      link.setAttribute("aria-describedby", messageSelectors.newWindowExternal);
    } else if (isExternal) {
      link.setAttribute("aria-describedby", messageSelectors.external);
    } else if (isTargetBlank) {
      link.setAttribute("aria-describedby", messageSelectors.newWindow);
    }
  });

  generateHTML(messages);
}

export function initNav(type, componentClass) {
  const elements = document.querySelectorAll("[data-watch-height-nav]");
  calculateHeight(elements);
  bindResize(elements);
}

function bindResize(elements) {
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      calculateHeight(elements);
    });
  });

  [].forEach.call(elements, (element) => {
    resizeObserver.observe(element);
  });
}

function calculateHeight(elements) {
  let height = 0;

  [].forEach.call(elements, (element) => {
    height += element.offsetHeight;
  });

  const nav = document.querySelector(".mobile-nav");
  nav.style.top = height + "px";
  nav.style.height = `calc(100vh - ${height}px)`;
}

const components = {};
const instances = [];
const COMPONENT_ATTRIBUTE = "data-component";

export function register(type, componentClass) {
  components[type] = componentClass;
}

export function load(wrapper = document) {
  const containers = wrapper.querySelectorAll(`[${COMPONENT_ATTRIBUTE}]`);

  Array.from(containers).forEach((container) => {
    const type = container.getAttribute(COMPONENT_ATTRIBUTE);

    if (!type || !components[type]) {
      return;
    }

    instances.push(new components[type](container));
  });

  window.components = instances;
}

export function isInViewport(element) {
  const bounding = element.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

import {
  load as loadSection,
  register as registerSection,
} from "@shopify/theme-sections";

export function register(type, sectionObject) {
  registerSection(type, sectionObject);
}

export function load() {
  loadSection("*");
}

// This is the exact same as Shopify's version of this, EXCEPT it does not force focus on the container element. It adds a confusing and unncessary step to keyboard users, who find their focus programmatically moved to an element that was previously unfocusable.

import { focusable } from "@shopify/theme-a11y";

/**
 * Traps the focus in a particular container
 *
 * @param {Element} container - Container DOM element to trap focus inside of
 * @param {Element} elementToFocus - Element to be focused on first
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 */

var trapFocusHandlers = {};

export function trapFocus(container, options) {
  options = options || {};
  var elements = focusable(container);
  var elementToFocus = options.elementToFocus || container;
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = function (event) {
    if (container !== event.target && !container.contains(event.target)) {
      first.focus();
    }

    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.keyCode !== 9) return; // If not TAB key

    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  first.focus();
}

/**
 * Removes the trap of focus from the page
 */
export function removeTrapFocus() {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
}

import "@babel/polyfill";

/* eslint-disable */
import "./sections/*.js";
import "./components/*.js";
/* eslint-enable */
import { load as loadSections } from "./lib/sections";
import { load as loadComponents } from "./lib/components";
import { accessibleLinks } from "./lib/accessible-links";
import { initNav } from "./lib/calculate-mobile-nav-height";

document.addEventListener(
  "DOMContentLoaded",
  function () {
    loadSections();
    loadComponents();
    accessibleLinks("a");
    initNav();

    if (document.querySelector("[data-form-status]")) {
      document.querySelector("[data-form-status]").focus();
    }
  },
  false
);
