const authRouter = require('express').Router();
const { register, login } = require('../controllers/user.controller');
const { asyncWrapper } = require('../utils');

authRouter.post('/register', asyncWrapper(register));
authRouter.post('/login', asyncWrapper(login));

module.exports = authRouter;
