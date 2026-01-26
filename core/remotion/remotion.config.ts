
import path from 'path';
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPublicDir(path.join(process.cwd(), 'core', 'remotion', 'public'));

// This is the important part:
// We are extending the Webpack config to resolve .ts and .tsx files.
Config.overrideWebpackConfig((webpackConfig) => {
  const extensions = webpackConfig.resolve?.extensions;
  if (extensions) {
    extensions.push('.ts', '.tsx');
  }
  return webpackConfig;
});
