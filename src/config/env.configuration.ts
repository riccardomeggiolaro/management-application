export default (): Record<string, object> => ({
  server: {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION_TIME,
  },
  mail: {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  i18n: {
    fallback: process.env.I18N_FALLBACK,
  },
  app: {
    baseUrl: process.env.APP_BASEURL,
  },
});
