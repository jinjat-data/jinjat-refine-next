
module.exports = {
  experimental: {
    newNextLinkBehavior: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
}