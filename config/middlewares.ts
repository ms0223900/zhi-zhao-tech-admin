export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dev-penguin.s3.ap-southeast-1.amazonaws.com', // change here
            'zhi-zhao-s3.s3.us-east-1.amazonaws.com',
            'market-assets.strapi.io'
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dev-penguin.s3.ap-southeast-1.amazonaws.com', // change here
            'zhi-zhao-s3.s3.us-east-1.amazonaws.com',
            'market-assets.strapi.io'
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formidable: {
        maxFileSize: 2 * 1024 * 1024, // 2MB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
