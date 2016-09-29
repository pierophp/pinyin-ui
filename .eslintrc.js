module.exports = {
  root: true,
  // parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'node'
  ],
  // add your custom rules here
  'rules': {
    //'import/no-unresolved': 0,
    'no-continue': 0,
    'no-param-reassign': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

/*
{
  "plugins": ["node"],
  "extends": ["eslint:recommended", "plugin:node/recommended"],
  "rules": {
    "node/exports-style": ["error", "module.exports"],
    "node/no-unpublished-bin": "error",
    "node/process-exit-as-throw": "error"
  }
}
*/
