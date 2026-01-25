import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

export async function createVideo() {
  // Ensure output directory exists
  const outDir = path.resolve('out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  // --- Randomization Logic ---

  const TEMPLATE_NAMES = [
    'animated-list',
    'animated-text',
    'bounce-text',
    'bubble-pop-text',
    'card-flip',
    'floating-bubble-text',
    'geometric-patterns',
    'glitch-text',
    'liquid-wave',
    'matrix-rain',
    'particle-explosion',
    'pulsing-text',
    'slide-text',
    'sound-wave',
    'typewriter-subtitle',
  ];

  // Weighted Color Palettes
  const COLOR_PALETTES = [
    { weight: 40, primary: '#3b82f6', secondary: '#93c5fd' }, // Blue (40%)
    { weight: 20, primary: '#ef4444', secondary: '#fca5a5' }, // Red (20%)
    { weight: 15, primary: '#10b981', secondary: '#6ee7b7' }, // Green (15%)
    { weight: 10, primary: '#f59e0b', secondary: '#fcd34d' }, // Amber (10%)
    { weight: 10, primary: '#8b5cf6', secondary: '#c4b5fd' }, // Violet (10%)
    { weight: 5,  primary: '#ec4899', secondary: '#f9a8d4' }, // Pink (5%)
  ];

  const SAMPLE_TEXTS = [
    "Welcome to Chocomotion",
    "Video Editing Made Easy",
    "Automated Generation",
    "Dynamic Content",
    "Engaging Visuals",
    "Scale Your Production",
    "Create More, Faster",
    "The Future of Video",
  ];

  function getRandomPalette() {
    const totalWeight = COLOR_PALETTES.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const palette of COLOR_PALETTES) {
      if (random < palette.weight) {
        return { primary: palette.primary, secondary: palette.secondary };
      }
      random -= palette.weight;
    }
    return COLOR_PALETTES[0];
  }

  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  // 1. Generate random number of scenes (2 to 5)
  const sceneCount = getRandomInt(5, 12);
  const scenes = [];

  for (let i = 0; i < sceneCount; i++) {
    const template = getRandomItem(TEMPLATE_NAMES);
    const { primary, secondary } = getRandomPalette();
    const text = getRandomItem(SAMPLE_TEXTS);
    const durationInFrames = 90; // 3 seconds per scene

    scenes.push({
      template,
      durationInFrames,
      props: {
        text,
        primaryColor: primary,
        secondaryColor: secondary,
      },
    });
  }

  const inputProps = { scenes };

  // ---------------------------

  // 1. Bundle the project
  // We point to the index.ts file which calls registerRoot
  const entryPoint = path.resolve(process.cwd(), 'core/remotion/index.ts');
  
  console.log('Bundling video...');
  const bundled = await bundle({
    entryPoint,
    // Optional: caching for faster subsequent bundles
    webpackOverride: (config) => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          extensionAlias: {
            '.js': ['.js', '.ts', '.tsx'],
          },
        },
      };
    }, 
  });

  // 2. Select composition
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'Main',
    inputProps, // Pass props here to calculate metadata correctly
  });

  // 3. Render
  const fileName = `video-${Date.now()}.mp4`;
  const outputLocation = path.join(outDir, fileName);
  
  console.log('Rendering video...');
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation,
    inputProps, // Pass props here for rendering
  });

  console.log(`Video rendered to ${outputLocation}`);

  // Read file to buffer
  const buffer = fs.readFileSync(outputLocation);

  // Clean up: delete local file
  fs.unlinkSync(outputLocation);
  console.log(`Local file deleted: ${outputLocation}`);

  return {
    buffer,
    fileName,
  };
}
