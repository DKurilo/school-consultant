// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import workspacesEslint from "eslint-plugin-workspaces";

const buildConfig = async () => {
  const workspacesRecommendedRules = Object.entries(
    workspacesEslint.configs.recommended.rules,
  ).reduce((o, [k, v]) => {
    Object.assign(o, { [k]: v === "error" ? "error" : "warn" });
    return o;
  }, {});

  return tseslint.config(
    {
      // config with just ignores is the replacement for `.eslintignore`
      ignores: ["**/build/**", "**/dist/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
      plugins: {
        workspaces: {
          rules: workspacesEslint.rules,
        },
      },
      rules: workspacesRecommendedRules,
    },
    ...new FlatCompat({ baseDirectory: "." }).extends(
      "plugin:prettier/recommended",
    ),
  );
};

export default buildConfig();
