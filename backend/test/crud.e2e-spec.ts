import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('CRUD API E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Store created entities for cleanup
  let createdUserIds: string[] = [];
  let createdQuizIds: string[] = [];
  let createdProfessionIds: string[] = [];
  let createdArchetypeIds: string[] = [];
  let createdCategoryId: string;
  let createdArchetypeTypeId: string;
  let createdRegionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    // Create prerequisite data
    const region = await prisma.region.create({
      data: {
        name: { en: 'Test Region', ru: 'Тестовый регион', kk: 'Тест аймағы' },
      },
    });
    createdRegionId = region.id;

    const category = await prisma.category.create({
      data: {
        name: { en: 'Technology', ru: 'Технология', kk: 'Технология' },
        description: { en: 'Tech category', ru: 'Категория технологий', kk: 'Технология санаты' },
      },
    });
    createdCategoryId = category.id;

    const archetypeType = await prisma.archetypeType.create({
      data: {
        name: { en: 'Holland Type', ru: 'Тип Холланда', kk: 'Холланд түрі' },
        description: { en: 'Holland RIASEC', ru: 'RIASEC Холланда', kk: 'Холланд RIASEC' },
      },
    });
    createdArchetypeTypeId = archetypeType.id;
  });

  afterAll(async () => {
    // Cleanup created data
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    await prisma.quiz.deleteMany({ where: { id: { in: createdQuizIds } } });
    await prisma.profession.deleteMany({ where: { id: { in: createdProfessionIds } } });
    await prisma.archetype.deleteMany({ where: { id: { in: createdArchetypeIds } } });
    await prisma.category.delete({ where: { id: createdCategoryId } });
    await prisma.archetypeType.delete({ where: { id: createdArchetypeTypeId } });
    await prisma.region.delete({ where: { id: createdRegionId } });

    await app.close();
  });

  // =====================================
  // PROFILES (USERS) MODULE TESTS
  // =====================================

  describe('Profiles Module - /users', () => {
    it('should create a new user (POST /users)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John',
          surname: 'Doe',
          email: 'john.doe@test.com',
          grade: '10',
          age: 16,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('John');
          expect(res.body.surname).toBe('Doe');
          expect(res.body.email).toBe('john.doe@test.com');
          expect(res.body.age).toBe(16);
          createdUserIds.push(res.body.id);
        });
    });

    it('should fail to create user with invalid email (POST /users)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Jane',
          surname: 'Smith',
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('should get all users (GET /users)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('userLicenses');
          expect(res.body[0]).toHaveProperty('userArchetypes');
          expect(res.body[0]).toHaveProperty('userProfessions');
        });
    });

    it('should get user by ID (GET /users/:id)', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserIds[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdUserIds[0]);
          expect(res.body).toHaveProperty('results');
        });
    });

    it('should update user (PATCH /users/:id)', () => {
      return request(app.getHttpServer())
        .patch(`/users/${createdUserIds[0]}`)
        .send({
          age: 17,
          grade: '11',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.age).toBe(17);
          expect(res.body.grade).toBe('11');
        });
    });

    it('should return 404 for non-existent user (GET /users/:id)', () => {
      return request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should create another user for later deletion test', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Delete',
          surname: 'Me',
          email: 'delete.me@test.com',
        })
        .expect(201)
        .expect((res) => {
          createdUserIds.push(res.body.id);
        });
    });

    it('should delete user (DELETE /users/:id)', () => {
      const userIdToDelete = createdUserIds[createdUserIds.length - 1];
      return request(app.getHttpServer())
        .delete(`/users/${userIdToDelete}`)
        .expect(204)
        .then(() => {
          // Verify user was deleted
          return request(app.getHttpServer())
            .get(`/users/${userIdToDelete}`)
            .expect(404);
        });
    });
  });

  // =====================================
  // QUIZZES MODULE TESTS
  // =====================================

  describe('Quizzes Module - /quizzes', () => {
    it('should create a new quiz (POST /quizzes)', () => {
      return request(app.getHttpServer())
        .post('/quizzes')
        .send({
          quizName: {
            en: 'Personality Test',
            ru: 'Тест личности',
            kk: 'Тұлға тесті',
          },
          quizType: 'PERSONALITY',
          isFree: true,
          description: {
            en: 'Discover your personality',
            ru: 'Откройте свою личность',
            kk: 'Өз тұлғаңызды табыңыз',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.quizType).toBe('PERSONALITY');
          expect(res.body.isFree).toBe(true);
          expect(res.body.quizName).toHaveProperty('en');
          createdQuizIds.push(res.body.id);
        });
    });

    it('should fail to create quiz with invalid type (POST /quizzes)', () => {
      return request(app.getHttpServer())
        .post('/quizzes')
        .send({
          quizName: { en: 'Test' },
          quizType: 'INVALID_TYPE',
          isFree: true,
        })
        .expect(400);
    });

    it('should get all quizzes (GET /quizzes)', () => {
      return request(app.getHttpServer())
        .get('/quizzes')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('questions');
          expect(res.body[0]).toHaveProperty('_count');
        });
    });

    it('should get quiz by ID (GET /quizzes/:id)', () => {
      return request(app.getHttpServer())
        .get(`/quizzes/${createdQuizIds[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdQuizIds[0]);
          expect(res.body).toHaveProperty('results');
        });
    });

    it('should update quiz (PATCH /quizzes/:id)', () => {
      return request(app.getHttpServer())
        .patch(`/quizzes/${createdQuizIds[0]}`)
        .send({
          isFree: false,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isFree).toBe(false);
        });
    });

    it('should create quiz for deletion test', () => {
      return request(app.getHttpServer())
        .post('/quizzes')
        .send({
          quizName: { en: 'Delete Me Quiz' },
          quizType: 'OTHER',
          isFree: true,
        })
        .expect(201)
        .expect((res) => {
          createdQuizIds.push(res.body.id);
        });
    });

    it('should delete quiz (DELETE /quizzes/:id)', () => {
      const quizIdToDelete = createdQuizIds[createdQuizIds.length - 1];
      return request(app.getHttpServer())
        .delete(`/quizzes/${quizIdToDelete}`)
        .expect(204)
        .then(() => {
          return request(app.getHttpServer())
            .get(`/quizzes/${quizIdToDelete}`)
            .expect(404);
        });
    });
  });

  // =====================================
  // PROFESSIONS MODULE TESTS
  // =====================================

  describe('Professions Module - /professions', () => {
    it('should create a new profession (POST /professions)', () => {
      return request(app.getHttpServer())
        .post('/professions')
        .send({
          name: {
            en: 'Software Engineer',
            ru: 'Инженер-программист',
            kk: 'Бағдарламалық инженер',
          },
          description: {
            en: 'Develops software',
            ru: 'Разрабатывает ПО',
            kk: 'Бағдарлама жасайды',
          },
          code: 'SE001',
          categoryId: createdCategoryId,
          featured: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.code).toBe('SE001');
          expect(res.body.featured).toBe(true);
          expect(res.body).toHaveProperty('category');
          createdProfessionIds.push(res.body.id);
        });
    });

    it('should fail to create profession with duplicate code (POST /professions)', async () => {
      return request(app.getHttpServer())
        .post('/professions')
        .send({
          name: { en: 'Another Engineer' },
          description: { en: 'Test' },
          code: 'SE001', // Duplicate code
          categoryId: createdCategoryId,
        })
        .expect(500); // Prisma will throw unique constraint error
    });

    it('should get all professions (GET /professions)', () => {
      return request(app.getHttpServer())
        .get('/professions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('category');
          expect(res.body[0]).toHaveProperty('professionSpecs');
          expect(res.body[0]).toHaveProperty('professionArchetypes');
          expect(res.body[0]).toHaveProperty('_count');
        });
    });

    it('should get profession by ID (GET /professions/:id)', () => {
      return request(app.getHttpServer())
        .get(`/professions/${createdProfessionIds[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdProfessionIds[0]);
          expect(res.body).toHaveProperty('professionSpecs');
        });
    });

    it('should update profession (PATCH /professions/:id)', () => {
      return request(app.getHttpServer())
        .patch(`/professions/${createdProfessionIds[0]}`)
        .send({
          featured: false,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.featured).toBe(false);
        });
    });

    it('should create profession for deletion test', () => {
      return request(app.getHttpServer())
        .post('/professions')
        .send({
          name: { en: 'Delete Me Profession' },
          description: { en: 'Will be deleted' },
          code: 'DELETE001',
          categoryId: createdCategoryId,
          featured: false,
        })
        .expect(201)
        .expect((res) => {
          createdProfessionIds.push(res.body.id);
        });
    });

    it('should delete profession (DELETE /professions/:id)', () => {
      const professionIdToDelete = createdProfessionIds[createdProfessionIds.length - 1];
      return request(app.getHttpServer())
        .delete(`/professions/${professionIdToDelete}`)
        .expect(204)
        .then(() => {
          return request(app.getHttpServer())
            .get(`/professions/${professionIdToDelete}`)
            .expect(404);
        });
    });
  });

  // =====================================
  // ARCHETYPES MODULE TESTS
  // =====================================

  describe('Archetypes Module - /archetypes', () => {
    it('should create a new archetype (POST /archetypes)', () => {
      return request(app.getHttpServer())
        .post('/archetypes')
        .send({
          name: {
            en: 'The Analyst',
            ru: 'Аналитик',
            kk: 'Талдаушы',
          },
          archetypeTypeId: createdArchetypeTypeId,
          description: {
            en: 'Analytical thinker',
            ru: 'Аналитический мыслитель',
            kk: 'Аналитикалық ойлаушы',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.archetypeTypeId).toBe(createdArchetypeTypeId);
          expect(res.body).toHaveProperty('archetypeType');
          createdArchetypeIds.push(res.body.id);
        });
    });

    it('should fail to create archetype with invalid typeId (POST /archetypes)', () => {
      return request(app.getHttpServer())
        .post('/archetypes')
        .send({
          name: { en: 'Test' },
          archetypeTypeId: '00000000-0000-0000-0000-000000000000',
          description: { en: 'Test' },
        })
        .expect(500); // Foreign key constraint
    });

    it('should get all archetypes (GET /archetypes)', () => {
      return request(app.getHttpServer())
        .get('/archetypes')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('archetypeType');
          expect(res.body[0]).toHaveProperty('professionArchetypes');
          expect(res.body[0]).toHaveProperty('_count');
        });
    });

    it('should get archetype by ID (GET /archetypes/:id)', () => {
      return request(app.getHttpServer())
        .get(`/archetypes/${createdArchetypeIds[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdArchetypeIds[0]);
          expect(res.body).toHaveProperty('userArchetypes');
        });
    });

    it('should update archetype (PATCH /archetypes/:id)', () => {
      return request(app.getHttpServer())
        .patch(`/archetypes/${createdArchetypeIds[0]}`)
        .send({
          description: {
            en: 'Updated description',
            ru: 'Обновленное описание',
            kk: 'Жаңартылған сипаттама',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.description.en).toBe('Updated description');
        });
    });

    it('should create archetype for deletion test', () => {
      return request(app.getHttpServer())
        .post('/archetypes')
        .send({
          name: { en: 'Delete Me Archetype' },
          archetypeTypeId: createdArchetypeTypeId,
          description: { en: 'Will be deleted' },
        })
        .expect(201)
        .expect((res) => {
          createdArchetypeIds.push(res.body.id);
        });
    });

    it('should delete archetype (DELETE /archetypes/:id)', () => {
      const archetypeIdToDelete = createdArchetypeIds[createdArchetypeIds.length - 1];
      return request(app.getHttpServer())
        .delete(`/archetypes/${archetypeIdToDelete}`)
        .expect(204)
        .then(() => {
          return request(app.getHttpServer())
            .get(`/archetypes/${archetypeIdToDelete}`)
            .expect(404);
        });
    });
  });

  // =====================================
  // INTEGRATION TESTS
  // =====================================

  describe('Integration Tests', () => {
    it('should handle concurrent requests', async () => {
      const promises = [
        request(app.getHttpServer()).get('/users'),
        request(app.getHttpServer()).get('/quizzes'),
        request(app.getHttpServer()).get('/professions'),
        request(app.getHttpServer()).get('/archetypes'),
      ];

      const results = await Promise.all(promises);
      results.forEach((res) => {
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
    });

    it('should validate required fields across all modules', async () => {
      const invalidRequests = [
        request(app.getHttpServer()).post('/users').send({}),
        request(app.getHttpServer()).post('/quizzes').send({}),
        request(app.getHttpServer()).post('/professions').send({}),
        request(app.getHttpServer()).post('/archetypes').send({}),
      ];

      const results = await Promise.all(invalidRequests);
      results.forEach((res) => {
        expect(res.status).toBe(400);
      });
    });
  });
});
