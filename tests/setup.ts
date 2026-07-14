// Only set up DOM-related mocks if window exists
if (typeof window !== 'undefined') {
  try {
    require('@testing-library/jest-dom');
  } catch (e) {
    // @testing-library/jest-dom not available, skip
  }

  // Mock window.matchMedia for responsive tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
