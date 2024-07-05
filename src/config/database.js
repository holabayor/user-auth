const { Sequelize } = require('sequelize');

const POSTGRES_URI = process.env.POSTGRES_URI;

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  logging: false,
  define: {
    freezeTableName: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  ssl: true,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.log('Failed to connect to the database');
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
