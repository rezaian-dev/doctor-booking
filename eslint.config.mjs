// 🧹 ESLint Configuration — Standard Setup for Next.js + TypeScript + Prettier 🚀
import js from '@eslint/js'; // 🔧 Import core JS rules
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint'; // 📦 Import TypeScript ESLint plugin
import prettier from 'eslint-config-prettier'; // 🚫 Disable ESLint rules conflicting with Prettier

// 🧩 Define the main ESLint configuration using tseslint.config
export default tseslint.config(
  // 🚫 Ignore specific build/distribution folders
  {
    ignores: [
      'dist',      // 👈 Output directory (if exists)
      '.next',     // 👈 Next.js build folder
      'out',       // 👈 Static export folder (if exists)
      'build',     // 👈 Build folder (if exists)
      'node_modules', // 👈 Dependency folder
    ]
  },
  {
    // 📁 Target all relevant JS/TS/JSX/TSX files
    files: ['**/*.{ts,tsx,js,jsx}'],

    // 🌐 Define language options (ES version, global variables)
    languageOptions: {
      ecmaVersion: 2020, // 📅 Use modern JS features
      globals: globals.browser, // 🔤 Recognize browser globals like 'window', 'document'
    },

    // 🧩 Apply recommended configurations and plugins
    extends: [
      js.configs.recommended, // 🧩 Core JS recommended rules
      ...tseslint.configs.recommended, // 🧩 TypeScript recommended rules
      reactHooks.configs.recommended, // 🎣 Rules for React Hooks
      'prettier', // 🚫 Turn off ESLint rules that conflict with Prettier
    ],

    // 🔌 Add plugins for specific functionalities
    plugins: {
      'react-refresh': reactRefresh, // 🔁 Plugin for Fast Refresh feedback
    },

    // ⚙️ Define custom rules
    rules: {
      // 🔄 Allow constant exports (e.g., export const MY_CONST = 'value')
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // 🚫 Apply the main 'eslint-config-prettier' config to ensure no conflicts
  prettier
);
