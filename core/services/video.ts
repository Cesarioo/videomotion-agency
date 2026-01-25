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
    inputProps: {}, // Pass props here if needed
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

