import { tw } from '../src/tw';
import { clearInjectedStyles, extractCriticalCSS } from '../src/internal/injector';

describe('tw() utility function', () => {
  beforeEach(() => {
    clearInjectedStyles();
  });

  it('should return the input class string unchanged', () => {
    const result = tw('flex flex-col gap-6 p-8');
    expect(result).toBe('flex flex-col gap-6 p-8');
  });

  it('should return empty string for empty input', () => {
    expect(tw('')).toBe('');
  });

  it('should inject CSS for each class token', () => {
    tw('flex flex-col gap-6 p-8');
    const css = extractCriticalCSS();

    expect(css).toContain('display: flex');
    expect(css).toContain('flex-direction: column');
    expect(css).toContain('gap: 1.5rem');
    expect(css).toContain('padding: 2rem');
  });

  it('should handle the reported broken utilities', () => {
    tw('rounded-lg px-4 py-2 gap-6 inline-flex');
    const css = extractCriticalCSS();

    expect(css).toContain('border-radius: 0.5rem');
    expect(css).toContain('padding-left: 1rem');
    expect(css).toContain('padding-right: 1rem');
    expect(css).toContain('padding-top: 0.5rem');
    expect(css).toContain('padding-bottom: 0.5rem');
    expect(css).toContain('gap: 1.5rem');
    expect(css).toContain('display: inline-flex');
  });

  it('should deduplicate — calling twice does not double inject', () => {
    tw('flex items-center');
    tw('flex items-center');
    const css = extractCriticalCSS();

    // Should appear exactly once
    const flexCount = (css.match(/display: flex/g) || []).length;
    expect(flexCount).toBe(1);
  });

  it('should handle responsive/variant classes', () => {
    tw('hover:bg-blue-500 md:flex-row');
    const css = extractCriticalCSS();

    expect(css).toContain(':hover');
    expect(css).toContain('@media');
  });

  it('should inject keyframes for built-in animations', () => {
    tw('animate-spin');
    const css = extractCriticalCSS();

    expect(css).toContain('@keyframes spin');
    expect(css).toContain('transform: rotate(360deg)');
    expect(css).toContain('animation: spin 1s linear infinite');
  });
});
