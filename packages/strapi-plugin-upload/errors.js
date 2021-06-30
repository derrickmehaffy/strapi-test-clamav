'use strict';

const errorTypes = {
  ENTITY_TOO_LARGE: 'entityTooLarge',
  UNKNOWN_ERROR: 'unknownError',
  VIRUS_ERROR: 'virusError'
};

const entityTooLarge = message => {
  const error = new Error(message || 'Entity too large');
  error.type = errorTypes.ENTITY_TOO_LARGE;
  return error;
};
entityTooLarge.type = errorTypes.ENTITY_TOO_LARGE;

const unknownError = message => {
  const error = new Error(message || 'Unknown error');
  error.type = errorTypes.UNKNOWN_ERROR;
  return error;
};
unknownError.type = errorTypes.UNKNOWN_ERROR;

const virusError = message => {
  const error = new Error(message || 'Virus Detected');
  error.type = errorTypes.VIRUS_ERROR;
  return error;
};
virusError.type = errorTypes.VIRUS_ERROR;

const is = (err, errorFactory) => {
  return err.type && err.type === errorFactory.type;
};

const convertToStrapiError = err => {
  if (is(err, entityTooLarge)) {
    return strapi.errors.entityTooLarge('FileTooBig', {
      errors: [
        {
          id: 'Upload.status.sizeLimit',
          message: 'file is bigger than the limit size!',
        },
      ],
    });
  } else if (is(err, virusError)) {
    console.log(err.message)
    return strapi.errors.conflict(`Virus Detected`, {
      errors: [
        {
          id: 'Upload.status.virusDetected',
          message: 'This file has a virus and cannot be uploaded',
        },
      ],
    });
  } else {
    strapi.log.error(err);
    console.log(err.type);
    return strapi.errors.badImplementation();
  }
};

module.exports = {
  errors: {
    entityTooLarge,
    virusError,
    unknownError,
  },
  convertToStrapiError,
};
