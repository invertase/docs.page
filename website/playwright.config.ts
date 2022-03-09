import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalTimeout: 5 * 60 * 1000, // 5 min global timeout
};
export default config;
