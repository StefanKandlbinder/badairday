import { test, expect } from '@playwright/test';

test.describe('PWA', () => {
  test('service worker registers and activates', async ({ page }) => {
    await page.goto('/');

    // Wait for SW to register and activate
    const swState = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return 'unsupported';
      const reg = await navigator.serviceWorker.ready;
      const worker = reg.active;
      if (!worker) return 'no active worker';
      if (worker.state === 'activated') return 'activated';
      return new Promise<string>((resolve) => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') resolve('activated');
        });
        // Timeout fallback
        setTimeout(() => resolve(worker.state), 3000);
      });
    });

    expect(swState).toBe('activated');
  });

  test('service worker is serving /service-worker.js', async ({ page }) => {
    const response = await page.request.get('/service-worker.js');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('javascript');
    const body = await response.text();
    // Workbox precaching and our custom handlers must be present
    expect(body).toContain('workbox:precaching');
    expect(body).toContain('workbox:routing');
    expect(body).toContain('geocode.arcgis.com');
    expect(body).toContain('api.luftdaten.info');
    expect(body).toContain('addEventListener(`push`');
    expect(body).toContain('addEventListener(`notificationclick`');
  });

  test('web app manifest is valid and served', async ({ page }) => {
    const response = await page.request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);
    const manifest = await response.json();

    expect(manifest.id).toBe('/');
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBe('BadAirDay');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#00796b');
    expect(manifest.lang).toBe('de');
    expect(manifest.start_url).toBe('/');
    expect(manifest.icons).toBeInstanceOf(Array);
    expect(manifest.icons.length).toBeGreaterThan(0);

    // Must have a maskable icon
    const maskable = manifest.icons.find((i: { purpose?: string }) => i.purpose === 'maskable');
    expect(maskable).toBeTruthy();

    // Must have 192x192 and 512x512 (installability requirement)
    const has192 = manifest.icons.some((i: { sizes: string }) => i.sizes === '192x192');
    const has512 = manifest.icons.some((i: { sizes: string }) => i.sizes === '512x512');
    expect(has192).toBe(true);
    expect(has512).toBe(true);
  });

  test('manifest is linked in HTML', async ({ page }) => {
    await page.goto('/');
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestHref).toBe('/manifest.webmanifest');
  });

  test('registerSW.js is injected and served', async ({ page }) => {
    await page.goto('/');
    // Script tag must be present in the DOM
    const swScript = await page.locator('script[src="/registerSW.js"]').getAttribute('src');
    expect(swScript).toBe('/registerSW.js');

    // File must be servable
    const response = await page.request.get('/registerSW.js');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('serviceWorker');
    expect(body).toContain('service-worker.js');
  });

  test('precache populates Cache Storage after activation', async ({ page }) => {
    await page.goto('/');

    // Wait for SW to be active and caches to be populated
    const cachedURLs = await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      // Give the SW install/activate a moment to cache assets
      await new Promise(r => setTimeout(r, 2000));
      const cacheNames = await caches.keys();
      const precacheName = cacheNames.find(n => n.includes('precache'));
      if (!precacheName) return [];
      const cache = await caches.open(precacheName);
      const keys = await cache.keys();
      return keys.map(r => new URL(r.url).pathname);
    });

    expect(cachedURLs.length).toBeGreaterThan(0);
    // index.html and the JS bundle must be precached
    expect(cachedURLs.some(u => u === '/' || u.endsWith('index.html'))).toBe(true);
    expect(cachedURLs.some(u => u.includes('assets/') && u.endsWith('.js'))).toBe(true);
  });

  test('apple-mobile-web-app meta tags are correct', async ({ page }) => {
    await page.goto('/');
    const capable = await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content');
    expect(capable).toBe('yes');

    const statusBar = await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content');
    // Must be a valid value, not a hex color
    expect(['default', 'black', 'black-translucent']).toContain(statusBar);

    const title = await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content');
    expect(title).toBe('BadAirDay');
  });

  test('theme-color meta tag matches manifest', async ({ page }) => {
    await page.goto('/');
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(themeColor).toBe('#00796b');
  });
});
