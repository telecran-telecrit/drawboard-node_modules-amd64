"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBeVisible = toBeVisible;

var _jestMatcherUtils = require("jest-matcher-utils");

var _utils = require("./utils");

function isStyleVisible(element) {
  const {
    getComputedStyle
  } = element.ownerDocument.defaultView;
  const {
    display,
    visibility,
    opacity
  } = getComputedStyle(element);
  return display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse' && opacity !== '0' && opacity !== 0;
}

function isAttributeVisible(element, previousElement) {
  return !element.hasAttribute('hidden') && (element.nodeName === 'DETAILS' && previousElement.nodeName !== 'SUMMARY' ? element.hasAttribute('open') : true);
}

function isElementVisible(element, previousElement) {
  return isStyleVisible(element) && isAttributeVisible(element, previousElement) && (!element.parentElement || isElementVisible(element.parentElement, element));
}

function toBeVisible(element) {
  (0, _utils.checkHtmlElement)(element, toBeVisible, this);
  const isVisible = isElementVisible(element);
  return {
    pass: isVisible,
    message: () => {
      const is = isVisible ? 'is' : 'is not';
      return [(0, _jestMatcherUtils.matcherHint)(`${this.isNot ? '.not' : ''}.toBeVisible`, 'element', ''), '', `Received element ${is} visible:`, `  ${(0, _jestMatcherUtils.printReceived)(element.cloneNode(false))}`].join('\n');
    }
  };
}