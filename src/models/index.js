const { sequelize } = require('../config/database');
const Organisation = require('./organisation.model');
const User = require('./user.model');

User.belongsToMany(Organisation, { through: 'UserOrganisation' });
Organisation.belongsToMany(User, { through: 'UserOrganisation' });

// sequelize.sync();

module.exports = { User, Organisation };
