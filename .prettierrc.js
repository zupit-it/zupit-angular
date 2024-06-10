const prettierConfigStandard = require('prettier-config-standard')

module.exports = {
  ...prettierConfigStandard,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@(libs/core|libs/feature|libs/ui|libs/util)/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy']
}
