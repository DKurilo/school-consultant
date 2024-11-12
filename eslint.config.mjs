// @ts-check
import tseslint from "typescript-eslint";

const buildConfig = async () => tseslint.config(
    {
      // config with just ignores is the replacement for `.eslintignore`
      ignores: ["**/build/**", "**/dist/**"],
    },
  );

export default buildConfig();

