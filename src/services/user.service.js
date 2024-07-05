const { Unauthorized, Conflict } = require('../middlewares/error');
const { User, Organisation } = require('../models');
const { generateToken, hashPassword, comparePassword } = require('../utils');

const createUser = async (data) => {
  const { firstName, lastName, email, password, phoneNumber } = data;
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Conflict('User with email already exists');
  }

  // Create the user
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  // Create user's organisation
  const organisation = await Organisation.create({
    name: `${firstName}'s organisation`,
  });
  await user.addOrganisation(organisation);

  const token = generateToken({ id: user.userId });
  return { token, user };
};

const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Unauthorized('Invalid email or password');
  }

  const token = generateToken({ id: user.userId });
  return { token, user };
};

const getUser = async (id) => {
  const user = await User.findOne({ where: { userId: id } });
  return user;
};

module.exports = { createUser, loginUser, getUser };
