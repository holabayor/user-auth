require('dotenv').config();
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
};

const sequelize = new Sequelize({
  dialect: 'postgres',
  ...config[env],
  logging: false,
});

const connectDB = async () => {
  try {
    // await sequelize.authenticate();
    console.log('Database connection successful');
  } catch (error) {
    console.log('Failed to connect to the database', error);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
