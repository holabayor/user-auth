const userService = require('../services/user.service');
const { validateSchema } = require('../utils');
const {
  registerSchema,
  loginSchema,
} = require('../validation/auth.validation');

const register = async (req, res) => {
  validateSchema(registerSchema, req.body);

  const { token, user } = await userService.createUser(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Registration successful',
    data: {
      accessToken: token,
      user,
    },
  });
};

const login = async (req, res) => {
  validateSchema(loginSchema, req.body);

  const { token, user } = await userService.loginUser(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      accessToken: token,
      user,
    },
  });
};

const getUser = async (req, res) => {
  const user = await userService.getUser(req.user.id);
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: user,
  });
};

module.exports = { register, login, getUser };
