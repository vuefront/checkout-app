{
  "root": true,
  "env": {
    "node": true,
    "browser": true
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "extends": [
    "plugin:vue/vue3-essential",
    "prettier",
    "plugin:prettier/recommended"
  ]
}
