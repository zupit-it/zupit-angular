const prettierConfigStandard = require('prettier-config-standard')

module.exports = {
  ...prettierConfigStandard,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@(libs/core|libs/feature|libs/ui|libs/util)/(.*)$',
    '^@(ps|pc|pd|pm|ss)/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy']
}
