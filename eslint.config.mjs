import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    env: {
      "node": true,  // 允許 Node.js 環境的全域變數
      "es2021": true
    },
    files: ["**/*.js"],
    languageOptions: {sourceType: "commonjs"},
    rules: {
      "no-tabs": ["error"],
      "no-trailing-spaces": ["error"],
      "no-var": ["error"],
      "indent": ["error", 4],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "max-len": ["warn", { "code": 500 }]
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];