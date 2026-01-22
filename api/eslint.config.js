import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
            ecmaVersion: 2022,
            sourceType: "commonjs",
        },
    },
    pluginJs.configs.recommended,
    {
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": "off",
        },
    },
    {
        ignores: ["node_modules/", "uploads/"],
    },
];
