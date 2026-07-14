/**
 * Internal Initialization Module
 *
 * Registers all utility builders with the CSS generator.
 * This module is imported as a side effect by the generator module
 * to ensure the utility registry is populated before any CSS generation.
 *
 * @internal
 */

import { registerSpacingUtilities } from './builders/spacing';
import { registerSizingUtilities } from './builders/sizing';
import { registerLayoutUtilities } from './builders/layout';
import { registerFlexboxUtilities } from './builders/flexbox';
import { registerGridUtilities } from './builders/grid';
import { registerTypographyUtilities } from './builders/typography';
import { registerColorUtilities } from './builders/colors';
import { registerBackgroundUtilities } from './builders/background';
import { registerBorderUtilities } from './builders/borders';
import { registerEffectsUtilities } from './builders/effects';
import { registerTransformUtilities } from './builders/transforms';
import { registerFilterUtilities } from './builders/filters';
import { registerTransitionUtilities } from './builders/transitions';
import { registerInteractivityUtilities } from './builders/interactivity';

// Guard: only initialize once
let initialized = false;

export function initializeBuilders(): void {
  if (initialized) return;
  initialized = true;

  registerSpacingUtilities();
  registerSizingUtilities();
  registerLayoutUtilities();
  registerFlexboxUtilities();
  registerGridUtilities();
  registerTypographyUtilities();
  registerColorUtilities();
  registerBackgroundUtilities();
  registerBorderUtilities();
  registerEffectsUtilities();
  registerTransformUtilities();
  registerFilterUtilities();
  registerTransitionUtilities();
  registerInteractivityUtilities();
}

// Auto-initialize on import
initializeBuilders();
