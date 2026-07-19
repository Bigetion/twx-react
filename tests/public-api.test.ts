import * as publicApi from '../src';

describe('public API surface', () => {
  it('keeps core runtime APIs available while excluding theme APIs from the main entrypoint', () => {
    expect(publicApi.tw).toBeDefined();
    expect(publicApi.createTwComponent).toBeDefined();
    expect(publicApi.createTwSlots).toBeDefined();
    expect(publicApi.createTwCompound).toBeDefined();

    expect('createTwTheme' in publicApi).toBe(false);
    expect('TwThemeProvider' in publicApi).toBe(false);
    expect('useTwTheme' in publicApi).toBe(false);
  });
});
