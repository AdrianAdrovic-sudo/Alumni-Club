// backend/eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Base JS recommendations
  js.configs.recommended,

  // Ignore build artifacts
  {
    ignores: ["dist/**", "node_modules/**"]
  },

  // TypeScript rules for app code
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      // style
      "quotes": ["error", "single"],
      "semi": ["error", "always"],

      // TS hygiene
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "no-unused-vars": "off" // prefer the TS version
    }
  },

  // Jest test files
  {
    files: ["src/tests/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "quotes": ["error", "single"]
    }
  },

  // Config files written in CommonJS
  {
    files: ["*.config.js", "*.config.cjs", "jest.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-undef": "off" // allow require/module in these files
    }
  }
];
