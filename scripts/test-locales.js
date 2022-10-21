const checker = require('node-i18n-checker');
const reporter = checker.reporters.standard;

const options = {
  baseDir: __dirname,
  dirs: [
    {
      localeDir: '../locales',
      core: true,
    },
  ],
  verifyOptions: {
    fileType: 'json',
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'it'],
    rules: [
      'all-keys-translated', // All keys translated in default locale must be translated in other locales.
      'all-locales-present', // All directories must contain translation files for all locales defined in options.verifyOptions.locales list.
      'valid-json-file', // Every translation files must be valid JSON file and has no duplicate keys.
    ],
  },
};

checker(options, (err, report) => {
  reporter(report);
  if (err) console.log(err);
});
