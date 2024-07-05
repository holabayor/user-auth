const orgRouter = require('express').Router();
const {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
} = require('../controllers/organisation.controller');
const { asyncWrapper } = require('../utils');

orgRouter.get('/', asyncWrapper(getOrganisations));
orgRouter.get('/:orgId', asyncWrapper(getOrganisation));
orgRouter.post('/', asyncWrapper(createOrganisation));
orgRouter.post('/:orgId/users', asyncWrapper(addUserToOrganisation));

module.exports = orgRouter;
