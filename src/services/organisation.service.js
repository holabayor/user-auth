const { ResourceNotFound, Forbidden } = require('../middlewares/error');
const { User, Organisation } = require('../models');

const getOrganisation = async (id) => {
  const organisation = await Organisation.findOne({ where: { orgId: id } });
  if (!organisation) {
    throw new ResourceNotFound('Organisation not found');
  }

  const userOrganisations = await user.getOrganisations({
    where: { orgId: id },
  });
  if (!userOrganisations.length) {
    throw new Forbidden('Access denied');
  }
  return organisation;
};

const getOrganisations = async (userId) => {
  const user = await User.findOne({ where: { userId } });
  return await user.getOrganisations();
};

const createOrganisation = async (userId, data) => {
  const { name, description } = data;
  const user = await User.findOne({ where: { userId } });

  const newOrganisation = await Organisation.create({ name, description });
  await user.addOrganisation(newOrganisation);

  return newOrganisation;
};

const addUserToOrganisation = async (userId, orgId) => {
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    throw new ResourceNotFound('User not found');
  }

  const organisation = await Organisation.findOne({ where: { orgId } });
  if (!organisation) {
    throw new ResourceNotFound('Oorganisation not found');
  }

  await organisation.addUser(user);
};

module.exports = {
  getOrganisation,
  getOrganisations,
  createOrganisation,
  addUserToOrganisation,
};
