import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TestDbModule } from './utils/test-db.module';
import { Project } from './entities/project.entity';
import { Species } from './entities/species.entity';
import { CreateProjectDto } from './dto/create-project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule, TypeOrmModule.forFeature([Project, Species])],
      controllers: [ProjectsController],
      providers: [ProjectsService],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
    app = module.createNestApplication();
    await app.init();

    // Seed database
    const projects = [
      {
        name: 'Puerto Rico Island Wide',
        slug: 'puerto-rico-island-wide',
        summary: 'Acoustic monitoring and occupancy maps for...',
        siteCount: 940,
        speciesCount: 96,
        highlightedSpecies: [
          { code: 'amavi', name: 'Amazona vittata', status: 'CR' },
        ],
      },
      {
        name: 'South Africa Test Project',
        slug: 'south-africa-test-project',
        summary: 'Camera trap data collected for analysis',
        siteCount: 780,
        speciesCount: 87,
        highlightedSpecies: [
          {
            code: 'agexa',
            name: 'Agelaius xanthomus',
            status: 'EN',
          },
        ],
      },
    ] as Project[];
    await service.seedTestDatabase(projects);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/projects (GET) => returns projects', async () => {
    const response = await request(app.getHttpServer())
      .get('/projects')
      .expect(200);

    expect(response.body.length).toEqual(2);
  });

  it('/projects?species=amavi (GET) => filters projects by species', async () => {
    const response = await request(app.getHttpServer())
      .get('/projects?species=amavi')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].name).toEqual('Puerto Rico Island Wide');
    expect(response.body[0].siteCount).toEqual(940);
    expect(response.body[0].highlightedSpecies).toBeInstanceOf(Array);
    expect(response.body[0].highlightedSpecies.length).toEqual(1);
    expect(response.body[0].highlightedSpecies[0].code).toEqual('amavi');
  });

  it('/projects (POST) => creates a new project', async () => {
    const projectToCreate: CreateProjectDto = {
      name: 'POST project test',
      slug: 'post-project-test',
      summary: 'Test summary for test project in POST request',
      siteCount: 180,
      speciesCount: 74,
      highlightedSpecies: [
        {
          code: 'species-1',
          name: 'Species 1',
          status: 'DD',
        },
      ],
    };
    const response = await request(app.getHttpServer())
      .post('/projects')
      .send(projectToCreate)
      .expect(201);

    expect(response.body.id).toEqual(3);
    expect(response.body.name).toEqual('POST project test');
    expect(response.body.siteCount).toEqual(180);
    expect(response.body.highlightedSpecies).toBeInstanceOf(Array);
    expect(response.body.highlightedSpecies.length).toEqual(1);
  });

  it('/projects/{id} (PATCH) => updates an existing project', async () => {
    const projectPatch: Partial<Project> = {
      name: 'PATCH project test',
    };
    const response = await request(app.getHttpServer())
      .patch('/projects/1')
      .send(projectPatch)
      .expect(200);

    expect(response.body.name).toEqual('PATCH project test');
  });

  it('/projects/{id} (PATCH) => gets 404 for non-existent project', async () => {
    const projectPatch: Partial<Project> = {
      name: 'PATCH project test',
    };
    await request(app.getHttpServer())
      .patch('/projects/100')
      .send(projectPatch)
      .expect(404);
  });
});
