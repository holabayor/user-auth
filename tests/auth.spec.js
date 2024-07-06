const { sequelize } = require('../src/config/database');
const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /auth/register', () => {
  it('should register user successfully and with a default organisation', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      password: '123456',
      phoneNumber: '08191234567',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'Registration successful');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user.firstName).toEqual('John');

    // Verify that the default organisation was created
    const user = await User.findOne({
      where: { email: res.body.data.user.email },
    });
    const organisations = await user.getOrganisations();
    expect(organisations.length).toEqual(1);
    expect(organisations[0].name).toEqual(
      `${res.body.data.user.firstName}'s Organisation`
    );
  });

  it('should fail to register user - duplicate email', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      password: '123456',
      phoneNumber: '08191234567',
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status', 'Conflict');
    expect(res.body).not.toHaveProperty('data');
  });

  it('should fail to register user - invalid user input', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoeemail.com',
      password: '123456',
      phoneNumber: '08191234567',
    });
    // console.log('This is the response', res.body);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('status', 'InvalidInput');
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    );
  });

  it('should fail to register user with missing fields', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'John',
      email: 'johndoeemail.com',
      password: '123456',
      phoneNumber: '08191234567',
    });
    // console.log('This is the response', res.body);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('status', 'InvalidInput');
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'lastName' })])
    );
  });

  it('should login user successfully', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user.firstName).toEqual('John');
    expect(res.body.data.user.email).toEqual('johndoe@email.com');
    expect(res.body.data.user).not.toHaveProperty('password');
  });
  it('should fail to login user with incorrect credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'johndoe@email.com',
      password: '12345',
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('status', 'Unauthorized');
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
});
