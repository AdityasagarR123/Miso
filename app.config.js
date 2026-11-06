// Adds the sub-path the published website lives at, such as /Biso on GitHub
// Pages. Local development leaves it unset, so the app runs at the root.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    baseUrl: process.env.EXPO_BASE_URL || undefined,
  },
});
