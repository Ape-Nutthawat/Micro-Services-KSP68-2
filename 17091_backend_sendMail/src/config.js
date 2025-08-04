/**
 * @type { {
 * app: {
 * env: string,
 * port: number,
 * domain: string,
 * jwtKey: string,
 * },
 * db: {
 * main: import('mariadb').PoolConfig,
 * mongo: {
 *   host: string,
 *   port: number,
 *   user: string,
 *   password: string,
 *   maxPoolSize: number,
 *   database: string,
 * }
 * },
 * smtp: {
 *   debug: boolean,
 *   requireTLS: boolean,
 *   host: string,
 *   secure: boolean,
 *   port: number,
 *   auth: { user: string, pass: string },
 *   tls: { rejectUnauthorized: boolean }
 * }
 * } }
 */
const config = {
  app: {
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    domain: process.env.DOMAIN,
    jwtKey: process.env.JWT_KEY,
  },
  db: {
    main: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectionLimit: process.env.DB_CONNECTION_LIMIT,
      metaAsArray: true,
      bigIntAsNumber: true,
      insertIdAsNumber: true,
    },
    mongo: {
      host: process.env.DB_HOST_MONGO,
      port: process.env.DB_PORT_MONGO,
      user: process.env.DB_USER_MONGO,
      password: process.env.DB_PASSWORD_MONGO,
      maxPoolSize: process.env.DB_POOL_SIZE_MONGO,
      database: process.env.DB_NAME_MONGO,
    },
  },
  smtp: {
    debug: false,
    requireTLS: true,
    host: process.env.SMTP_HOST,
    secureConnection: false,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
};

export default config;
