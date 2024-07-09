const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const { hashPassword, generateToken } = require('../src/utils');
const { User, Organisation } = require('../src/models');

let userId, token;
const randomId = 'a3240a4f-f93c-40ec-85ef-425c09d64eb2';

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const hashedPassword = await hashPassword('password123');
  const user = await User.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@mail.com',
    password: hashedPassword,
    phone: '08191234567',
  });
  userId = user.userId;
  token = generateToken({ id: user.userId });
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/organisations', () => {
  it('should get all organisations for the logged in user', async () => {
    const res = await request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data.organisations).toBeDefined();
  });
});

describe('POST /api/organisations', () => {
  it('should create a new organisation', async () => {
    const res = await request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'HNG11 Organisation',
        description: 'This is a new HNG11 Internship organisation',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('orgId');
    expect(res.body.data.name).toBe('HNG11 Organisation');
  });

  it('should fail to create organisation if fields are missing', async () => {
    const res = await request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'This is a new HNG11 Internship organisation',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('status', 'InvalidInput');
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});

describe('GET /api/organisations/:orgId', () => {
  let organisation;

  beforeAll(async () => {
    organisation = await Organisation.create({
      name: 'Test Organisation',
      description: 'This is a test organisation',
    });
    await organisation.addUser(userId);
  });

  it('should get the organisation details', async () => {
    const res = await request(app)
      .get(`/api/organisations/${organisation.orgId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('orgId');
  });

  it('should fail if the organisation does not exist', async () => {
    const res = await request(app)
      .get(`/api/organisations/${randomId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status', 'ResourceNotFound');
    expect(res.body).toHaveProperty('message', 'Organisation not found');
  });
});

describe('POST /api/organisations/:orgId/users', () => {
  let organisation;

  beforeAll(async () => {
    organisation = await Organisation.create({
      name: "Tinubu's Organisation",
      description: 'This is a tinubu test organisation',
    });
    await organisation.addUser(userId);
  });

  it('should add a user to the organisation', async () => {
    const newUser = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@email.com',
      password: await hashPassword('password123'),
      phone: '08187654321',
    });

    const res = await request(app)
      .post(`/api/organisations/${organisation.orgId}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: newUser.userId,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.message).toEqual('User added to organisation successfully');
  });

  it('should fail if the user does not exist', async () => {
    const res = await request(app)
      .post(`/api/organisations/${organisation.orgId}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: randomId,
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status', 'ResourceNotFound');
    expect(res.body.data).not.toBeDefined();
  });
});
