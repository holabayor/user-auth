const organisationService = require('../services/organisation.service');
const {
  createOrgSchema,
  addUserToOrgSchema,
} = require('../validation/organisation.validation');
const { validateSchema } = require('../utils');

const getOrganisation = async (req, res) => {
  const orgId = req.params.orgId;
  const organisation = await organisationService.getOrganisation(orgId);
  res.status(200).json({
    status: 'success',
    message: 'Registration successful',
    data: organisation,
  });
};

const getOrganisations = async (req, res) => {
  const organisations = await organisationService.getOrganisations(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Organizations retrieval successful',
    data: organisations,
  });
};

const createOrganisation = async (req, res) => {
  validateSchema(createOrgSchema, req.body);

  const organisation = await organisationService.createOrganisation(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Organization retrieval successful',
    data: organisation,
  });
};

const addUserToOrganisation = async (req, res) => {
  validateSchema(addUserToOrgSchema, req.body);

  const { userId } = req.body;
  const { orgId } = req.params;

  await organisationService.addUserToOrganisation(userId, orgId);

  res.status(200).json({
    status: 'success',
    message: 'User added to organisation successfully',
  });
};

module.exports = {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
};
