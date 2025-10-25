import { Config } from '@remotion/cli/config';

// Override FFmpeg command to exclude metadata that might cause duration issues
Config.overrideFfmpegCommand(({ args }) => {
  const customFfmpegOptions = ['-map_metadata', '-1'];
  args.splice(args.length - 1, 0, ...customFfmpegOptions);
  return args;
});

// Set timeout to prevent rendering interruptions
Config.setTimeoutInMilliseconds(300000); // 5 minutes timeout

// Set concurrency for better performance
Config.setConcurrency(1);
