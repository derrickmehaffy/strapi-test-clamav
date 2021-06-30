module.exports = ({ env }) => ({
  upload: {
    provider: "clamav-proxy",
    providerOptions: {
      uploadProvider: "strapi-provider-upload-local",
      clamav: {
        host: env("CLAMAV_HOST", "127.0.0.1"),
        port: env.int("CLAMAV_PORT", 3310),
        timeout: env.int("CLAMAV_TIMEOUT", 3000),
      },
      localServer: {
        maxage: 2592000000,
      },
    },
  },
});
