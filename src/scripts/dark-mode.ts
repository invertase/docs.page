export const STORAGE_KEY = 'oss-docs-dark-mode';
export const DARK_MODE_CLASS_NAME = 'dark';
export const LIGHT_MODE_CLASS_NAME = 'light';
export const HTML_DATA_ATTRIBUTE = 'theme';

export default `
(function() {
  // Change these if you use something different in your hook.
  var storageKey = '${STORAGE_KEY}';
  var classNameDark = '${DARK_MODE_CLASS_NAME}';
  var classNameLight = '${LIGHT_MODE_CLASS_NAME}';

  function setClassOnDocumentBody(darkMode) {
    document.body.classList.add(darkMode ? classNameDark : classNameLight);
    document.body.classList.remove(darkMode ? classNameLight : classNameDark);
    document.documentElement.dataset['${HTML_DATA_ATTRIBUTE}'] = darkMode ? 'dark' : 'light';
  }
  
  var preferDarkQuery = '(prefers-color-scheme: dark)';
  var mql = window.matchMedia(preferDarkQuery);
  var supportsColorSchemeQuery = mql.media === preferDarkQuery;
  var localStorageTheme = null;
  try {
    localStorageTheme = localStorage.getItem(storageKey);
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null;
  if (localStorageExists) {
    localStorageTheme = JSON.parse(localStorageTheme);
  }

  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setClassOnDocumentBody(localStorageTheme);
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    setClassOnDocumentBody(mql.matches);
    localStorage.setItem(storageKey, mql.matches);
  } else {
    // source of truth from document.body
    var isDarkMode = document.body.classList.contains(classNameDark);
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode));
  }
})();
`;
