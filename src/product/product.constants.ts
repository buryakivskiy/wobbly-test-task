export const PRODUCT_CONSTANTS = Object.freeze({
  DOMAIN: {
    ENTITY: {
      NAME: {
        MAX_LENGTH: 255,
      },
      DESCRIPTION: {
        MAX_LENGTH: 1000,
      },
      CATEGORY: {
        MAX_LENGTH: 100,
      },
      PRICE: {
        MIN_VALUE: 1,
      },
    },
  },
  APPLICATION: {
    REPOSITORY_TOKEN: Symbol('PRODUCT_REPOSITORY_TOKEN'),
  },
});
