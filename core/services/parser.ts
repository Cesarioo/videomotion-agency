import puppeteer from 'puppeteer';
import sharp from 'sharp';

export interface ParsedData {
  text: string;
  colors: {
    background: Record<string, number>;
    typography: Record<string, number>;
    screenshotPixels: Record<string, number>;
  };
  socialUrls: string[];
}

const SOCIAL_DOMAINS = [
  'facebook.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'instagram.com',
  'youtube.com',
  'tiktok.com',
  'pinterest.com',
  'snapchat.com',
  'reddit.com',
  'discord.com',
  'discord.gg',
  't.me',
  'telegram.org',
  'whatsapp.com',
  'medium.com',
  'github.com',
  'gitlab.com',
  'bitbucket.org'
];

export async function parseUrl(url: string): Promise<ParsedData> {
  let browser;
  try {
    console.log(`[Parser] Starting parse for URL: ${url}`);

    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    console.log(`[Parser] Normalized URL: ${url}`);

    console.log('[Parser] Launching Puppeteer...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('[Parser] Browser launched.');

    const page = await browser.newPage();
    console.log('[Parser] Page created.');
    
    // Set viewport to standard desktop size for accurate layout calculations
    await page.setViewport({ width: 1440, height: 900 });

    console.log('[Parser] Navigating to URL...');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('[Parser] Navigation complete.');

    // Extract Data in Browser Context
    console.log('[Parser] Evaluating page content...');
    
    // We define the function as a string to avoid transpilation artifacts (like __name)
    // being injected into the browser context where they are undefined.
    const extractData = `
      (socialDomains) => {
        const _socialDomains = socialDomains;

        function rgbToHex(rgb) {
          if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return null;
          
          if (rgb.startsWith('rgba')) {
            const rgba = rgb.match(/\\d+(\\.\\d+)?/g);
            if (rgba && rgba.length === 4 && parseFloat(rgba[3]) === 0) return null;
          }

          const separator = rgb.indexOf(",") > -1 ? "," : " ";
          const rgbValues = rgb.substr(4).split(")")[0].split(separator);
          
          if (rgbValues.length < 3) return null;

          const r = (+rgbValues[0]).toString(16).padStart(2, '0');
          const g = (+rgbValues[1]).toString(16).padStart(2, '0');
          const b = (+rgbValues[2]).toString(16).padStart(2, '0');

          return ('#' + r + g + b).toLowerCase();
        }

        const backgroundMap = {};
        const typographyMap = {};
        const socialUrls = []; // Set is not fully serializable in all contexts, array is safer
        let allText = '';

        const elements = document.querySelectorAll('*');
        
        elements.forEach((el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          
          if (rect.width === 0 || rect.height === 0 || style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') === 0) {
            return;
          }

          const area = rect.width * rect.height;
          
          const bgHex = rgbToHex(style.backgroundColor);
          if (bgHex) {
            backgroundMap[bgHex] = (backgroundMap[bgHex] || 0) + area;
          }

          let hasText = false;
          let textLen = 0;
          
          el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) {
              hasText = true;
              textLen += node.textContent.trim().length;
              allText += node.textContent.trim() + ' ';
            }
          });

          if (hasText) {
            const textHex = rgbToHex(style.color);
            if (textHex) {
              const fontSize = parseFloat(style.fontSize) || 16;
              const textArea = (fontSize * fontSize * 0.6) * textLen;
              typographyMap[textHex] = (typographyMap[textHex] || 0) + textArea;
            }
          }

          if (el.tagName === 'A') {
            const href = el.href;
            if (href) {
              try {
                const hostname = new URL(href).hostname.toLowerCase();
                if (_socialDomains.some((domain) => hostname.includes(domain))) {
                  if (!socialUrls.includes(href)) {
                    socialUrls.push(href);
                  }
                }
              } catch (e) {}
            }
          }
        });

        return {
          text: allText.trim(),
          backgroundMap,
          typographyMap,
          socialUrls
        };
      }
    `;

    // @ts-ignore
    const data = await page.evaluate(eval(extractData), SOCIAL_DOMAINS);
    
    console.log('[Parser] Page evaluation complete.');
    console.log(`[Parser] Found ${data.socialUrls.length} social URLs.`);
    console.log(`[Parser] Found ${Object.keys(data.backgroundMap).length} background colors.`);
    console.log(`[Parser] Found ${Object.keys(data.typographyMap).length} typography colors.`);
    console.log(`[Parser] Text length extracted: ${data.text.length} chars.`);

    // Sort Maps by Weight - Limit to Top 50 to avoid massive payloads
    function sortMap(map: Record<string, number>): Record<string, number> {
      return Object.entries(map)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 50)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {} as Record<string, number>);
    }

    const result = {
      text: data.text,
      colors: {
        background: sortMap(data.backgroundMap),
        typography: sortMap(data.typographyMap),
        screenshotPixels: {},
      },
      socialUrls: data.socialUrls
    };

    console.log('[Parser] Starting screenshot analysis...');
    const screenshotColors: Record<string, number> = {};
    const MAX_SCROLLS = 10;

    for (let i = 0; i < MAX_SCROLLS; i++) {
      console.log(`[Parser] Processing screenshot ${i + 1}/${MAX_SCROLLS}`);
      
      const buffer = await page.screenshot();
      
      // Resize to 200px height, remove alpha channel to get RGB
      const { data: pixelData, info } = await sharp(buffer)
        .resize({ height: 200 })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Iterate through pixels (3 channels: R, G, B)
      for (let j = 0; j < pixelData.length; j += 3) {
        const r = pixelData[j];
        const g = pixelData[j + 1];
        const b = pixelData[j + 2];
        // Convert to Hex
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        screenshotColors[hex] = (screenshotColors[hex] || 0) + 1;
      }

      // Scroll down
      const canScrollMore = await page.evaluate(() => {
        const previousScroll = window.scrollY;
        window.scrollBy(0, window.innerHeight);
        // Check if we actually scrolled
        return window.scrollY > previousScroll;
      });

      if (!canScrollMore) {
        console.log('[Parser] Reached end of page.');
        break;
      }

      // Wait for content to load/render after scroll
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('[Parser] Processing screenshot color map...');
    result.colors.screenshotPixels = sortMap(screenshotColors);
    console.log(`[Parser] Screenshot analysis complete. Top ${Object.keys(result.colors.screenshotPixels).length} colors extracted.`);

    console.log('[Parser] Parsing finished successfully.');
    return result;

  } catch (error) {
    console.error('[Parser] Error parsing URL:', error);
    throw error;
  } finally {
    if (browser) {
      console.log('[Parser] Closing browser...');
      await browser.close();
      console.log('[Parser] Browser closed.');
    }
  }
}
