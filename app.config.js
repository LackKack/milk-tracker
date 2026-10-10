// Extends app.json. The web build's URL prefix depends on the host:
// GitHub Pages serves this repo under /milk-tracker, Vercel serves it at /.
// Set EXPO_BASE_URL=/milk-tracker for Pages; leave it unset for root hosting.
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;
  if (!baseUrl) return config;
  return {
    ...config,
    experiments: { ...config.experiments, baseUrl },
  };
};
