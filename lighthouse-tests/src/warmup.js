import puppeteer from 'puppeteer-core';

// Approximate Lighthouse's emulation viewports so the warm-up triggers the same
// responsive `srcset` URLs Lighthouse will request during measurement.
const VIEWPORTS = {
  mobile: { width: 412, height: 823, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true },
  desktop: { width: 1350, height: 940, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
};

const NAV_TIMEOUT_MS = 60_000;
const NETWORK_IDLE_MS = 1_000;
const NETWORK_IDLE_TIMEOUT_MS = 30_000;
const SCROLL_STEP_DELAY_MS = 100;

async function scrollWholePage(page) {
  await page.evaluate(async (stepDelay) => {
    await new Promise((resolve) => {
      let scrolled = 0;
      const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
      const interval = setInterval(() => {
        const max = document.documentElement.scrollHeight;
        window.scrollBy(0, step);
        scrolled += step;
        if (scrolled >= max + window.innerHeight) {
          clearInterval(interval);
          window.scrollTo(0, 0);
          resolve();
        }
      }, stepDelay);
    });
  }, SCROLL_STEP_DELAY_MS);
}

async function forceLoadAllImages(page) {
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }
            // Lazy images need a hint to start loading even after a scroll, in case
            // the IntersectionObserver hasn't fired yet (e.g. fixed-height containers).
            img.loading = 'eager';
            if (img.dataset?.src && !img.getAttribute('src')) {
              img.setAttribute('src', img.dataset.src);
            }
            const done = () => resolve();
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
            // Belt-and-braces: directly fetch whatever the browser has chosen as
            // the current src (handles srcset selection) so the CDN is warmed
            // even if the <img> element itself never finishes loading.
            const src = img.currentSrc || img.src;
            if (src) {
              fetch(src, { mode: 'no-cors', credentials: 'omit' })
                .catch(() => {})
                .finally(done);
            } else {
              done();
            }
          })
      )
    );
  });
}

export async function warmupUrl({ url, port, formFactor }) {
  const browser = await puppeteer.connect({
    browserURL: `http://localhost:${port}`,
    defaultViewport: null,
  });
  let page;
  try {
    page = await browser.newPage();
    await page.setCacheEnabled(true);
    await page.setViewport(VIEWPORTS[formFactor] ?? VIEWPORTS.desktop);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: NAV_TIMEOUT_MS });
    await scrollWholePage(page);
    await page
      .waitForNetworkIdle({ idleTime: NETWORK_IDLE_MS, timeout: NETWORK_IDLE_TIMEOUT_MS })
      .catch(() => {});
    await forceLoadAllImages(page);
    await page
      .waitForNetworkIdle({ idleTime: NETWORK_IDLE_MS, timeout: NETWORK_IDLE_TIMEOUT_MS })
      .catch(() => {});
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    browser.disconnect();
  }
}
