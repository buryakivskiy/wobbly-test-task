export const USER_CONSTANTS = Object.freeze({
  DOMAIN: {
    ENTITY: {
      EMAIL: {
        MAX_LENGTH: 256,
      },
      PASSWORD: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 64,
      },
    },
  },
  APPLICATION: {
    REPOSITORY_TOKEN: Symbol('USER_REPOSITORY_TOKEN'),
  },
});
