const clamd = require("clamdjs");
const { errors } = require("strapi-plugin-upload");
const { omit } = require("lodash/fp");

const cleanProviderOptions = omit(["uploadProvider", "clamav"]);

const virusError = (reply) => {
  const virus = reply.replace("stream:", "").replace(" FOUND", "").trim();
  return errors.virusError(`This file is infected with a virus: ${virus}`);
};

module.exports = {
  init(options) {
    const uploadProvider = require(options.uploadProvider);
    const uploader = uploadProvider.init(cleanProviderOptions(options));

    const scanner = clamd.createScanner(
      options.clamav.host,
      options.clamav.port
    );

    return {
      async upload(file) {
        const reply = await scanner.scanBuffer(
          file.buffer,
          options.clamav.timeout,
          1024 * 1024
        );

        if (!clamd.isCleanReply(reply)) {
          throw virusError(reply);
        }

        return uploader.upload(file);
      },
      delete(file) {
        return uploader.delete(file);
      },
    };
  },
};
