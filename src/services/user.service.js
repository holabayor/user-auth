const { Unauthorized, Conflict } = require('../middlewares/error');
const { User, Organisation } = require('../models');
const { generateToken, hashPassword, comparePassword } = require('../utils');

/**
 * Creates a new user and a default organisation for the user
 *
 * @param {Object} data - The data to create the user
 * @param {string} data.firstName - The first name of the user
 * @param {string} data.lastName - The last name of the user
 * @param {string} data.email - The email of the user
 * @param {string} data.password - The password of the user
 * @param {string} data.phoneNumber - The phone number of the user
 * @throws {Conflict} - If a user with the email already exists
 * @returns {Promise<{token: string, user: User}>} - The created user and token
 */
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
    name: `${firstName}'s Organisation`,
  });
  await user.addOrganisation(organisation);

  const token = generateToken({ id: user.userId });
  return { token, user };
};

/**
 * Logs in a user
 *
 * @param {Object} data - The data to login the user
 * @param {string} data.email - The email of the user
 * @param {string} data.password - The password of the user
 * @throws {Unauthorized} - If the email or password is invalid
 * @returns {Promise<{token: string, user: User}>} - The user and token
 */
const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Unauthorized('Invalid email or password');
  }

  const token = generateToken({ id: user.userId });
  return { token, user };
};

/**
 * Retrieves a user by ID
 *
 * @param {string} id - The user ID
 * @returns {Promise<User|null>} - The user or null
 */
const getUser = async (id) => {
  const user = await User.findOne({ where: { userId: id } });
  return user;
};

module.exports = { createUser, loginUser, getUser };
