/**
 * Preflight CSS Injection Module
 *
 * Injects Tailwind's preflight (CSS reset/normalize) into the DOM at runtime.
 * Preflight is auto-injected when any twx-react API is imported.
 * Call `disablePreflight()` before importing component APIs to opt out.
 *
 * @packageDocumentation
 */

import { isSSR } from './internal/injector';

const PREFLIGHT_ID = 'twx-react-preflight';
let preflightInjected = false;
let preflightDisabled = false;

/**
 * The minified preflight CSS content (Tailwind's CSS reset).
 * Embedded as a string constant to avoid runtime file reads.
 */
const PREFLIGHT_CSS = `progress, sub, sup {vertical-align: baseline;}a, button {background-color: transparent;}blockquote, body, dd, dl, fieldset, figure, h1, h2, h3, h4, h5, h6, hr, ol, p, pre, ul {margin: 0;}button, hr, input {overflow: visible;}a, legend {color: inherit;}html {line-height: 1.15;-webkit-text-size-adjust: 100%;}details, main {display: block;}h1 {font-size: 2em;}code, kbd, pre, samp {font-size: 1em;}a {text-decoration: inherit;}abbr[title] {border-bottom: none;text-decoration: underline;-webkit-text-decoration: underline dotted;text-decoration: underline dotted;}b, strong {font-weight: bolder;}small {font-size: 80%;}sub, sup {font-size: 75%;line-height: 0;position: relative;}sub {bottom: -0.25em;}sup {top: -0.5em;}button, input, optgroup, select, textarea {font-family: inherit;font-size: 100%;line-height: 1.15;margin: 0;}button, select {text-transform: none;}[type="button"], [type="reset"], [type="submit"], button {-webkit-appearance: button;}[type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner, button::-moz-focus-inner {border-style: none;padding: 0;}[type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring, button:-moz-focusring {outline: ButtonText dotted 1px;}legend {box-sizing: border-box;display: table;max-width: 100%;padding: 0;white-space: normal;}textarea {overflow: auto;resize: vertical;}[type="checkbox"], [type="radio"] {box-sizing: border-box;padding: 0;}[type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button {height: auto;}[type="search"] {-webkit-appearance: textfield;outline-offset: -2px;}[type="search"]::-webkit-search-decoration {-webkit-appearance: none;}::-webkit-file-upload-button {-webkit-appearance: button;font: inherit;}summary {display: list-item;}[hidden], template {display: none;}button {background-image: none;}fieldset {padding: 0;}ol, ul {list-style: none;padding: 0;}*, ::after, ::before {box-sizing: border-box;border: 0 solid #e2e8f0;}hr {box-sizing: content-box;height: 0;border-top-width: 1px;}img {border-style: solid;}input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {color: #a0aec0;}input:-ms-input-placeholder, textarea:-ms-input-placeholder {color: #a0aec0;}input::-ms-input-placeholder, textarea::-ms-input-placeholder {color: #a0aec0;}input::placeholder, textarea::placeholder {color: #a0aec0;}[role="button"], button {cursor: pointer;}table {border-collapse: collapse;}h1, h2, h3, h4, h5, h6 {font-size: inherit;font-weight: inherit;}button, input, optgroup, select, textarea {padding: 0;line-height: inherit;color: inherit;}code, kbd, pre, samp {font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;}audio, canvas, embed, iframe, img, object, svg, video {display: block;vertical-align: middle;}img, video {max-width: 100%;height: auto;}`;

/**
 * Disable automatic preflight injection.
 * Call this BEFORE importing any twx-react component APIs if you don't want the reset.
 *
 * @example
 * ```ts
 * import { disablePreflight } from 'twx-react';
 * disablePreflight();
 * // Now import components — preflight won't be injected
 * ```
 */
export function disablePreflight(): void {
  preflightDisabled = true;
}

/**
 * Manually inject Tailwind's preflight (CSS reset) into the DOM.
 *
 * This is called automatically by the library unless `disablePreflight()` was called first.
 * You can also call it manually if you disabled auto-injection but later want the reset.
 *
 * No-op in SSR environments or if already injected.
 */
export function injectPreflight(): void {
  if (preflightInjected || isSSR()) return;
  preflightInjected = true;

  // Check if already in DOM (e.g. from SSR hydration)
  if (document.getElementById(PREFLIGHT_ID)) return;

  const style = document.createElement('style');
  style.id = PREFLIGHT_ID;
  style.setAttribute('data-twx-react-preflight', '');
  style.textContent = PREFLIGHT_CSS;

  // Insert BEFORE the utility styles so utilities can override preflight
  const utilityStyle = document.getElementById('twx-react-styles');
  if (utilityStyle) {
    document.head.insertBefore(style, utilityStyle);
  } else {
    document.head.appendChild(style);
  }
}

/**
 * Auto-inject preflight unless disabled. Called internally by the library.
 * @internal
 */
export function autoInjectPreflight(): void {
  if (!preflightDisabled) {
    injectPreflight();
  }
}
