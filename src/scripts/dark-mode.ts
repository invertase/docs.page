export const STORAGE_KEY = 'docs.page:dark-mode';
export const DARK_MODE_CLASS_NAME = 'dark';
export const LIGHT_MODE_CLASS_NAME = 'light';
export const HTML_DATA_ATTRIBUTE = 'theme';

export default `
if (localStorage["${STORAGE_KEY}"] === 'dark' || (!("${STORAGE_KEY}" in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark')
} else {
  document.body.classList.remove('dark')
}
`;
