import pluginJs from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // Base configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Core JavaScript rules
  pluginJs.configs.recommended,

  // Import rules
  importPlugin.flatConfigs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React rules
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],

  // React Hooks rules
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Accessibility (a11y) rules
  {
    plugins: {
      'jsx-a11y': pluginJsxA11y,
    },
    rules: {
      // Critical accessibility rules as errors
      'jsx-a11y/alt-text': 'error', // Enforce all <img> tags have alt prop
      'jsx-a11y/aria-props': 'error', // Enforce all aria-* props are valid
      'jsx-a11y/aria-proptypes': 'error', // Enforce ARIA state and property values are valid
      'jsx-a11y/aria-role': 'error', // Enforce aria role attribute has valid value
      'jsx-a11y/aria-unsupported-elements': 'error', // Enforce that elements don't have aria-* props that don't support them
      'jsx-a11y/role-has-required-aria-props': 'error', // Enforce that elements with ARIA roles have all required attributes for that role
      'jsx-a11y/role-supports-aria-props': 'error', // Enforce that elements with a defined role contain only supported ARIA attributes

      // Important accessibility rules as warnings (to avoid breaking existing code)
      'jsx-a11y/anchor-has-content': 'warn', // Enforce all anchors to have content
      'jsx-a11y/heading-has-content': 'warn', // Enforce heading elements have content
      'jsx-a11y/html-has-lang': 'warn', // Enforce html element has lang prop
      'jsx-a11y/img-redundant-alt': 'warn', // Enforce img alt prop doesn't contain the word "image", "picture", or "photo"
      'jsx-a11y/interactive-supports-focus': 'warn', // Enforce that elements with interactive handlers like onClick must be focusable
      'jsx-a11y/label-has-associated-control': 'warn', // Enforce that <label> elements have an associated control
      'jsx-a11y/mouse-events-have-key-events': 'warn', // Enforce that onMouseOver/onMouseOut are accompanied by onFocus/onBlur
      'jsx-a11y/no-access-key': 'warn', // Enforce no accessKey prop on element
      'jsx-a11y/no-autofocus': 'warn', // Enforce autoFocus prop is not used
      'jsx-a11y/no-distracting-elements': 'warn', // Enforce not using <marquee> or <blink> elements
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'warn', // Interactive elements should not be assigned non-interactive roles
      'jsx-a11y/no-noninteractive-element-interactions': 'warn', // Non-interactive elements should not be assigned mouse or keyboard event listeners
      'jsx-a11y/no-noninteractive-tabindex': 'warn', // tabIndex should only be declared on interactive elements
      'jsx-a11y/no-redundant-roles': 'warn', // Enforce explicit role is not the same as implicit/default role
      'jsx-a11y/scope': 'warn', // Enforce scope prop is only used on <th> elements
      'jsx-a11y/tabindex-no-positive': 'warn', // Enforce tabIndex value is not greater than zero
    },
  },

  // Custom rules and overrides
  {
    rules: {
      // Enforce newline before return statements (as warning to avoid breaking existing code)
      'newline-before-return': 'warn',

      // Disabled rules with explanations
      'no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

      // Import-specific rules
      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
      'import/named': 'off',
      'import/no-named-as-default-member': 'off',

      // React-specific rules
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'off',
    },
  },

  // Next.js specific rules
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },

  // Prettier integration (must be last to override other style rules)
  eslintConfigPrettier,

  // Files to ignore
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'scripts/**',
      '**/*.d.ts',
      '**/*.config.{js,ts,mjs}',
      '**/*.setup.{js,ts}',
      '**/*.{spec,test}.{js,ts,jsx,tsx}',
    ],
  },
]
