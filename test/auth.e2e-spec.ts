import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const newUser = {
    name: 'E2E User',
    email: 'e2e@test.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    address: 'Test address',
    phone: '123456789',
    country: 'Test country',
    city: 'Test city',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  beforeEach(async () => {
    // 🔥 Resetea completamente la base de datos en cada test
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup → should create user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(newUser)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBeUndefined();
  });

  it('POST /auth/signin → should return access_token', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(newUser)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
  });

  it('POST /auth/signin → should fail with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(newUser)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: newUser.email,
        password: 'WrongPassword!',
      })
      .expect(401);
  });
});
