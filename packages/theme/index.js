module.exports = function themeMDXv2() {
  return {
    name: "docusaurus-theme-mdx-v2",

    getThemePath() {
      return "./theme";
    },
    configureWebpack(config) {
      config.module.rules.forEach((rule) => {
        if (String(rule.test) === String(/\.mdx?$/i)) {
          rule.use = rule.use.map((use) => {
            if (use.loader.includes("mdx-loader")) {
              return {
                ...use,
                // loader: require.resolve("@docusaurus/mdx-loader"),
                loader: require.resolve("docusaurus-mdx-loader-v2"),
              };
            } else {
              return use;
            }
          });
        }
      });

      return {
        mergeStrategy: { "module.rules": "replace" },
        module: { rules: config.module.rules },
      };
    },
  };
};
