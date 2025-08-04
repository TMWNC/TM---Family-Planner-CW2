// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import header from 'eslint-plugin-header';
import { defineConfig } from 'eslint/config';

// plug in containing the rules for comment standards for the program
const requireCommentsPlugin = {
  rules: {
    'require-comments': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Require comments above if/for/while and at top of file',
        },
        fixable: 'code',
        schema: [],
      },
      create(context) {
        const sourceCode = context.getSourceCode();

        /**
         * Finds the heading comment and decides if the header is in place for each file
         */
        function hasLeadingComment(node) {
          const comments = sourceCode.getCommentsBefore(node);
          return comments.length > 0;
        }

        /**
        *insert comment fix will add Add comment where code needs commenting 
         */
        function insertCommentAbove(node) {
          return fixer => fixer.insertTextBefore(node, '/* Add comment */\n');
        }

        return {
          Program(node) {
            const firstNode = node.body[0];
            /* decides if a top level comment is in place if not return message */
if (firstNode && !hasLeadingComment(firstNode)) {
              context.report({
                node: firstNode,
                message: 'File should start with a top-level comment.',
                fix: insertCommentAbove(firstNode)
              });
            }
          },

          IfStatement(node) {
            /* decides if an if statement has a comment if not apply fix if --fix is used */
if (!hasLeadingComment(node)) {
              context.report({
                node,
                message: 'Add a comment above this if statement.',
                fix: insertCommentAbove(node)
              });
            }
          },

          ForStatement(node) {
           /* decides if a for loop statement has a comment if not apply fix if --fix is used */
if (!hasLeadingComment(node)) {
              context.report({
                node,
                message: 'Add a comment above this for loop.',
                fix: insertCommentAbove(node)
              });
            }
          },

          WhileStatement(node) {
            /* decides if a while loop statement has a comment if not apply fix if --fix is used */
if (!hasLeadingComment(node)) {
              context.report({
                node,
                message: 'Add a comment above this while loop.',
                fix: insertCommentAbove(node)
              });
            }
          },
        };
      },
    },
  },
};

export default defineConfig([
  //  Jest test files
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },

  //  Front-end (browser) scripts
  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: globals.browser,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },

  //  Node/server-side + plugins and rules
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: ['public/**', '**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: {
      js,
      jsdoc,
      header,
      'require-comments': requireCommentsPlugin,
    },
    extends: ['js/recommended'],
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

      //  Require JSDoc comments for functions/classes
      'jsdoc/require-jsdoc': ['error', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      }],
      'jsdoc/require-description': 'error',

      //  Enforce custom rule: comments above if/for/while + top of file
      'require-comments/require-comments': 'warn',
    },
  },
]);
