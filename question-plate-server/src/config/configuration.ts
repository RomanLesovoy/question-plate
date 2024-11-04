// todo interface

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'quiz_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: '24h',
  },
  externalApi: {
    baseUrl: process.env.EXTERNAL_API_URL,
  },
});