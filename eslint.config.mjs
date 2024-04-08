// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'no-new': 'off',
  },
  ignores: [
    'node_modules/',
    'main.js',
  ],
})
