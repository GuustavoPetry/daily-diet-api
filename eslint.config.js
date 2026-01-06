import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.ts", "**/*.tsx"],
        extends: [
            // Extende configurações pré-definidas do typescript-eslint
            tseslint.configs.recommended,
            tseslint.configs.stylisticTypeChecked
        ],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json" // obrigatório se utilizar regras com TypeChecked
            },
        },
        rules: {
            semi: ["error", "always"]
        },
    }
])