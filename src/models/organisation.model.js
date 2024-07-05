const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Organisation = sequelize.define(
  'Organisation',
  {
    orgId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'organisations',
    timestamps: true,
  }
);
module.exports = Organisation;
