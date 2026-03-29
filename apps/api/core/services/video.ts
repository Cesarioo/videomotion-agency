import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { textToSpeech, type LanguageCode } from './llm.js';

// Path to context.json
const contextPath = path.resolve(process.cwd(), 'core/remotion/templates/context.json');

/**
 * Load context.json fresh (allows hot-reloading during development)
 */
function loadContext(): VideoContext {
  return JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
}

interface SceneContext {
  id: string;
  context: string;
  durationInFrames: number;
  durationInSeconds: number;
  base_text: Record<LanguageCode, string>;
  defaultProps: Record<string, unknown>;
}

interface Template {
  name: string;
  scenes: string[];
}

interface VideoContext {
  scenes: SceneContext[];
  templates: Template[];
  metadata: {
    fps: number;
  };
}

interface CreateVideoParams {
  type: string;
  variables: Record<string, string>;
  language?: LanguageCode;
}

/**
 * Replaces variables in text with their values
 * Variables are in format {variable_name}
 */
function replaceVariables(text: string, variables: Record<string, unknown>): string {
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === 'string') {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
  }
  return result;
}

/**
 * Extracts variable names from text (format: {variable_name})
 */
function extractVariables(text: string): string[] {
  const matches = text.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return matches.map(m => m.slice(1, -1));
}

/**
 * Creates a video from a template type with dynamic variables
 * @param params - The video creation parameters
 * @param params.type - The template type (e.g., 'seo-agency')
 * @param params.variables - Variables to replace in scene texts (e.g., { agency_name: 'MyAgency' })
 * @param params.language - Language code for TTS audio ('a'=American English, 'b'=British English, 'e'=Spanish, 'f'=French)
 */
export async function createVideo(params: CreateVideoParams) {
  const { type, variables, language = 'a' } = params;
  const videoContext = loadContext();

  // Find the template by type
  const template = videoContext.templates.find(t => t.name === type);
  if (!template) {
    throw new Error(`Template type '${type}' not found. Available types: ${videoContext.templates.map(t => t.name).join(', ')}`);
  }

  // Get scenes for this template
  const sceneContexts = template.scenes.map(sceneId => {
    const scene = videoContext.scenes.find(s => s.id === sceneId);
    if (!scene) {
      throw new Error(`Scene '${sceneId}' not found in context`);
    }
    return scene;
  });

  // Ensure output and public directories exist
  const outDir = path.resolve('out');
  const publicDir = path.resolve(process.cwd(), 'core/remotion/public');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  // Generate audio for each scene sequentially and save to public folder
  console.log('Generating audio for scenes...');
  const generatedAudioFiles: string[] = [];

  for (const sceneContext of sceneContexts) {
    // Merge defaultProps with user-provided variables (user variables override defaults)
    const mergedProps = {
      ...sceneContext.defaultProps,
      ...variables,
    };
    // Get the base text for the selected language, fallback to American English
    const baseText = sceneContext.base_text[language] || sceneContext.base_text['a'];
    const text = replaceVariables(baseText, mergedProps);
    console.log(`Generating audio for scene '${sceneContext.id}' (lang: ${language}): "${text.substring(0, 50)}..."`);
    
    const audioBuffer = await textToSpeech(text, 'male', language);
    const audioPath = path.join(publicDir, `${sceneContext.id}.mp3`);
    
    fs.writeFileSync(audioPath, audioBuffer);
    generatedAudioFiles.push(audioPath);
    console.log(`Audio saved: ${audioPath}`);
  }

  // Build scenes for Remotion
  const scenes = sceneContexts.map(sceneContext => {
    // Merge defaultProps with user-provided variables
    const mergedProps = {
      ...sceneContext.defaultProps,
      ...variables,
    };
    // Get the base text for the selected language, fallback to American English
    const baseText = sceneContext.base_text[language] || sceneContext.base_text['a'];
    return {
      template: sceneContext.id,
      durationInFrames: sceneContext.durationInFrames,
      props: {
        ...mergedProps,
        text: replaceVariables(baseText, mergedProps),
      },
    };
  });

  const inputProps = { scenes };

  // Bundle the project
  const entryPoint = path.resolve(process.cwd(), 'core/remotion/index.ts');
  
  console.log('Bundling video...');
  const bundled = await bundle({
    entryPoint,
    publicDir,
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

  // Select composition
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'Main',
    inputProps,
  });

  // Render
  const fileName = `video-${type}-${Date.now()}.mp4`;
  const outputLocation = path.join(outDir, fileName);
  
  const renderStartTime = Date.now();
  let lastProgressLog = 0;
  
  console.log(`Rendering video (${composition.durationInFrames} frames)...`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation,
    inputProps,
    onProgress: ({ renderedFrames, encodedFrames, renderedDoneIn, encodedDoneIn }) => {
      const now = Date.now();
      // Log progress every 2 seconds to avoid spam
      if (now - lastProgressLog >= 2000) {
        lastProgressLog = now;
        const progress = Math.round((renderedFrames / composition.durationInFrames) * 100);
        const estimatedSecondsLeft = renderedDoneIn !== null 
          ? Math.ceil(renderedDoneIn / 1000)
          : null;
        
        const timeLeftStr = estimatedSecondsLeft !== null
          ? `~${estimatedSecondsLeft}s remaining`
          : 'calculating...';
        
        console.log(`Rendering: ${progress}% (${renderedFrames}/${composition.durationInFrames} frames) - ${timeLeftStr}`);
      }
    },
  });

  const renderDuration = ((Date.now() - renderStartTime) / 1000).toFixed(1);
  console.log(`Video rendered to ${outputLocation} in ${renderDuration}s`);

  // Read file to buffer
  const buffer = fs.readFileSync(outputLocation);

  // Clean up: delete local video file
  fs.unlinkSync(outputLocation);
  console.log(`Local video file deleted: ${outputLocation}`);

  // Clean up: delete generated audio files
  console.log('Cleaning up generated audio files...');
  for (const audioPath of generatedAudioFiles) {
    try {
      fs.unlinkSync(audioPath);
      console.log(`Deleted: ${audioPath}`);
    } catch (e) {
      console.warn(`Failed to delete audio file: ${audioPath}`);
    }
  }

  return {
    buffer,
    fileName,
  };
}

/**
 * Get available template types
 */
export function getAvailableTemplates(): string[] {
  const videoContext = loadContext();
  return videoContext.templates.map(t => t.name);
}

/**
 * Get required variables for a template type
 * Returns variables found in base_text patterns like {variable_name}
 */
export function getTemplateVariables(type: string): string[] {
  const videoContext = loadContext();
  const template = videoContext.templates.find(t => t.name === type);
  
  if (!template) {
    return [];
  }

  // Collect all unique variables from base_text of all scenes in the template
  // Check all language variants for variables
  const variables = new Set<string>();
  for (const sceneId of template.scenes) {
    const scene = videoContext.scenes.find(s => s.id === sceneId);
    if (scene) {
      // Extract variables from all language variants
      for (const langText of Object.values(scene.base_text)) {
        extractVariables(langText).forEach(v => variables.add(v));
      }
    }
  }

  return Array.from(variables);
}
