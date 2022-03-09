import shiki from 'shiki';

export const theme = await shiki.loadTheme(
  '../../node_modules/shiki/themes/github-dark-dimmed.json',
);
