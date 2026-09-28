import type { Express } from 'express';

// Boot smoke test for issue #1559.
//
// `backend/src/app.ts` unconditionally calls `registerModules(app)`, which
// `require()`s the route/service files for every domain module. If any of
// those modules has a broken relative import, the app cannot boot at all.
// Nothing in the test suite previously imported `../app` end-to-end, so
// broken imports were only discovered at deploy time.
//
// This test imports the real app module and asserts it produces a valid
// Express application. Any module registered by `registerModules(app)` that
// throws on `require()` will make this test fail.
//
// Per the issue's dependency note, modules whose imports are still broken are
// stubbed with `jest.mock` so this smoke test can land before the per-module
// import fixes merge. Remove each mock as its module is fixed.

jest.mock('../modules/webhook/routes', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../modules/content/routes.tts', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('app boot smoke test', () => {
  it('imports ../app and returns a valid Express app instance', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const app = require('../app').default as Express;

    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
    expect(typeof app.use).toBe('function');
    expect(typeof app.listen).toBe('function');
  });

  it('does not throw when registerModules(app) runs during import', () => {
    expect(() => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('../app');
      });
    }).not.toThrow();
  });
});
