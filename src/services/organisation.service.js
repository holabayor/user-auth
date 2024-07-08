const { ResourceNotFound, Forbidden } = require('../middlewares/error');
const { User, Organisation } = require('../models');

/**
 * Retrieves an organisation if the user has access to it
 *
 * @param {string} userId - The user ID
 * @param {string} orgId - The organisation ID
 * @throws {ResourceNotFound} - If the organisation is not found
 * @throws {Forbidden} - If the user does not have access to the organisation
 * @returns {Promise<Organisation>} - The organisation
 */
const getOrganisation = async (userId, orgId) => {
  const user = await User.findOne({ where: { userId } });
  const organisation = await Organisation.findOne({ where: { orgId } });
  if (!organisation) {
    throw new ResourceNotFound('Organisation not found');
  }

  const userOrganisations = await user.getOrganisations({
    where: { orgId },
  });
  if (!userOrganisations.length) {
    throw new Forbidden('Access denied');
  }
  return organisation;
};

/**
 * Retrieves the organisations the user has access to
 *
 * @param {string} userId - The user ID
 * @returns {Promise<Organisation[]>} - The organisations the user has access to
 */
const getOrganisations = async (userId) => {
  const user = await User.findOne({ where: { userId } });
  return await user.getOrganisations({
    attributes: ['orgId', 'name', 'description'],
    joinTableAttributes: [],
  });
};

/**
 *
 * @param {string} userId - The user ID
 * @param {Object} data - The data to create the organisation
 * @param {string} data.name - The name of the organisation
 * @param {string} data.description - The description of the organisation
 * @returns {Promise<Organisation>} - The created organisation
 */
const createOrganisation = async (userId, data) => {
  const { name, description } = data;
  const user = await User.findOne({ where: { userId } });

  const newOrganisation = await Organisation.create({ name, description });
  await user.addOrganisation(newOrganisation);

  return newOrganisation;
};

/**
 *
 * @param {string} userId - The user ID
 * @param {string} orgId - The organisation ID
 * @throws {ResourceNotFound} - If the user or organisation is not found
 * @returns {Promise<void>}
 */
const addUserToOrganisation = async (userId, orgId) => {
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    throw new ResourceNotFound('User not found');
  }

  const organisation = await Organisation.findOne({ where: { orgId } });
  if (!organisation) {
    throw new ResourceNotFound('Organisation not found');
  }

  await organisation.addUser(user);
};

module.exports = {
  getOrganisation,
  getOrganisations,
  createOrganisation,
  addUserToOrganisation,
};
