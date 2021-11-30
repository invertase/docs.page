module.exports = [
  // e.g. FooBar
  /^[A-Z].*/,
  // e.g. fooBar or .fooBar
  /^\.?[a-z0-9].*[A-Z0-9].*/,
  // e.g foo_bar or foo-bar-baz
  /^[a-z]*[-_][a-z]+.*/,
  // e.g. package:melos or dark:bg-blue,
  /^[A-Za-z]+:.*/,

  'config',
  'dev',
  'docsearch',
  'docsify',
  'favicon',
  'frontmatter',
  'invertase',
  'ios',
  'json',
  'linkable',
  'indexable',
  'md',
  'melos',
  'noindex',
  'npm',
  'parsable',
  'revalidate',
  'src',
  'theming',
  'txt',
  'zoomable',
  'subdirectory',
];
