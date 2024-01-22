import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('ProjectsService', () => {
  let projectsService: ProjectsService;
  let projectsRepository: Repository<Project>;

  const projectsRepositoryToken: string | Function =
    getRepositoryToken(Project);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: projectsRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    projectsService = module.get<ProjectsService>(ProjectsService);
    projectsRepository = module.get<Repository<Project>>(
      projectsRepositoryToken,
    );
  });

  it('should be defined', () => {
    expect(projectsService).toBeDefined();
  });
});
