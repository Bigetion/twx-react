import '../../src/internal/init';
import { mergeClassNames } from '../../src/internal/merger';
import { parseClassName } from '../../src/internal/parser';
import { generateCSS } from '../../src/internal/generator';

describe('mergeClassNames', () => {
  it('keeps divide-y-2 and divide-red-400 when border-slate-600 is present', () => {
    const merged = mergeClassNames('divide-y-2 divide-red-400 rounded border border-slate-600');
    expect(merged).toBe('divide-y-2 divide-red-400 rounded border border-slate-600');
  });

  it('keeps divide-x-2 and divide-solid together', () => {
    const merged = mergeClassNames('divide-x-2 divide-solid rounded');
    expect(merged).toBe('divide-x-2 divide-solid rounded');
  });

  it('keeps space-x-2 and ms-4 together', () => {
    const merged = mergeClassNames('space-x-2 ms-4');
    expect(merged).toBe('space-x-2 ms-4');
  });

  it('keeps space-y-2 and mt-4 together', () => {
    const merged = mergeClassNames('space-y-2 mt-4');
    expect(merged).toBe('space-y-2 mt-4');
  });

  it('only keeps last of conflicting space-x utilities', () => {
    const merged = mergeClassNames('space-x-2 space-x-4');
    expect(merged).toBe('space-x-4');
  });

  it('generates the correct CSS rule for divide-red-400', () => {
    const parsed = parseClassName('divide-red-400');
    const rule = generateCSS(parsed, 'divide-red-400');
    expect(rule).not.toBeNull();
    expect(rule?.selector).toBe('.divide-red-400 > :not([hidden]) ~ :not([hidden])');
    expect(rule?.properties).toEqual({ 'border-color': 'oklch(0.704 0.191 22.216)' });
  });
});
