const authenticated = require('../middlewares/auth');
const userRouter = require('express').Router();
const { getUser } = require('../controllers/user.controller');
const { asyncWrapper } = require('../utils');

userRouter.use(authenticated);
userRouter.get('/:id', asyncWrapper(getUser));

module.exports = userRouter;
