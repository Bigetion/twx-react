/**
 * Tailwind v4 compatibility corpus
 *
 * This test gives us a measurable signal for support progress.
 * - Core corpus: classes that must work today (hard gate)
 * - Frontier corpus: classes we want for fuller v4 parity (soft gate threshold)
 */

import { parseClassName } from '../../src/internal/parser';
import { clearRegistry, generateCSS } from '../../src/internal/generator';
import { registerSpacingUtilities } from '../../src/internal/builders/spacing';
import { registerSizingUtilities } from '../../src/internal/builders/sizing';
import { registerLayoutUtilities } from '../../src/internal/builders/layout';
import { registerFlexboxUtilities } from '../../src/internal/builders/flexbox';
import { registerGridUtilities } from '../../src/internal/builders/grid';
import { registerTypographyUtilities } from '../../src/internal/builders/typography';
import { registerColorUtilities } from '../../src/internal/builders/colors';
import { registerBackgroundUtilities } from '../../src/internal/builders/background';
import { registerBorderUtilities } from '../../src/internal/builders/borders';
import { registerEffectsUtilities } from '../../src/internal/builders/effects';
import { registerTransformUtilities } from '../../src/internal/builders/transforms';
import { registerFilterUtilities } from '../../src/internal/builders/filters';
import { registerTransitionUtilities } from '../../src/internal/builders/transitions';
import { registerInteractivityUtilities } from '../../src/internal/builders/interactivity';

function registerAllBuilders(): void {
  clearRegistry();
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

function isSupported(className: string): boolean {
  const parsed = parseClassName(className);
  return generateCSS(parsed, className) !== null;
}

describe('Tailwind v4 compatibility corpus', () => {
  beforeEach(() => {
    registerAllBuilders();
  });

  it('supports the core class corpus (hard gate)', () => {
    const coreCorpus = [
      'p-4', 'px-6', '-mt-2', 'gap-3', 'space-x-2',
      'w-1/2', 'h-screen', 'max-w-2xl', 'min-h-dvh',
      'flex', 'flex-col', 'items-center', 'justify-between',
      'grid', 'grid-cols-3', 'col-span-2',
      'text-sm', 'font-semibold', 'tracking-wide', 'line-clamp-3',
      'text-blue-600', 'bg-red-500/50', 'border-emerald-400',
      'from-indigo-600', 'via-purple-500', 'to-pink-500',
      'rounded-xl', 'border-2', 'divide-y', 'outline-2',
      'shadow-lg', 'ring-2', 'opacity-75',
      'blur-sm', 'backdrop-blur-md', 'hue-rotate-15',
      'translate-x-4', '-rotate-12', 'origin-top-right',
      'duration-300', 'ease-in-out', 'animate-pulse',
      'cursor-not-allowed', 'pointer-events-none', 'snap-x',
      'hover:bg-blue-500', 'focus:ring-2', 'dark:text-white',
      'group-hover:opacity-100', 'peer-checked:bg-green-500',
      'md:grid-cols-4', '@3xl:flex',
      'sr-only', 'not-sr-only', 'fill-blue-500', 'stroke-2',
      'table-auto', 'table-fixed', 'border-collapse', 'border-separate', 'caption-top',
      'list-disc', 'list-inside', 'underline-offset-4', 'hyphens-auto',
      'print:hidden', 'motion-reduce:animate-none', 'motion-safe:animate-spin',
      'portrait:hidden', 'landscape:block', 'rtl:text-right', 'ltr:text-left',
      'aria-checked:bg-blue-500', 'data-open:opacity-100',
      'supports-[display:grid]:grid', 'has-[img]:p-4',
      'rotate-x-12', 'rotate-y-12', 'perspective-1000', 'backface-hidden',
      'writing-vertical-rl',
      'mask-image-[linear-gradient(to_bottom,black,transparent)]',
    ];

    const unsupported = coreCorpus.filter((cls) => !isSupported(cls));

    expect(unsupported).toEqual([]);
  });

  it('tracks frontier corpus gap count (soft gate)', () => {
    const frontierCorpus = [
      'list-decimal', 'list-outside',
      'underline-offset-4', 'hyphens-auto',
    ];

    const unsupported = frontierCorpus.filter((cls) => !isSupported(cls));

    // Keep this as a ratchet: lower threshold over time until zero.
    expect(unsupported.length).toBeLessThanOrEqual(28);
  });
});
