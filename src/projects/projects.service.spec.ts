import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { Species } from './entities/species.entity';
import { TestDbModule } from './utils/test-db.module';

describe('ProjectsService', () => {
  let projectsService: ProjectsService;
  let repositoryMock: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule],
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
      ],
    }).compile();

    projectsService = module.get<ProjectsService>(ProjectsService);
    repositoryMock = module.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(projectsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects = [
        {
          name: 'Puerto Rico Island Wide',
          slug: 'puerto-rico-island-wide',
          summary: 'Acoustic monitoring and occupancy maps for...',
          siteCount: 940,
          speciesCount: 96,
          highlightedSpecies: [
            { code: 'amavi', name: 'Amazona vittata', status: 'CR' },
            { code: 'agexa', name: 'Agelaius xanthomus', status: 'EN' },
          ],
        },
      ] as Project[];
      jest.spyOn(repositoryMock, 'find').mockResolvedValue(projects);

      const results = await projectsService.findAll();

      expect(results).toEqual(projects);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        relations: {
          highlightedSpecies: true,
        },
        where: {},
      });
    });

    it('should return an array of projects, using species filter', async () => {
      const projects = [
        {
          name: 'Puerto Rico Island Wide',
          slug: 'puerto-rico-island-wide',
          summary: 'Acoustic monitoring and occupancy maps for...',
          siteCount: 940,
          speciesCount: 96,
          highlightedSpecies: [
            { code: 'amavi', name: 'Amazona vittata', status: 'CR' },
            { code: 'agexa', name: 'Agelaius xanthomus', status: 'EN' },
          ],
        },
      ] as Project[];
      const species = 'amavi';
      jest.spyOn(repositoryMock, 'find').mockResolvedValue(projects);

      const results = await projectsService.findAll({ species });

      expect(results).toEqual(projects);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        relations: {
          highlightedSpecies: true,
        },
        where: {
          highlightedSpecies: {
            code: species,
          },
        },
      });
    });
  });

  describe('create', () => {
    it('should create and return a project', async () => {
      const projectToCreate = {
        name: 'Puerto Rico Island Wide',
        slug: 'puerto-rico-island-wide',
        summary: 'Acoustic monitoring and occupancy maps for...',
        siteCount: 940,
        speciesCount: 96,
        highlightedSpecies: [
          { code: 'amavi', name: 'Amazona vittata', status: 'CR' } as Species,
          {
            code: 'agexa',
            name: 'Agelaius xanthomus',
            status: 'EN',
          } as Species,
        ],
      } as Project;
      const createdProject = Object.assign(projectToCreate, {
        id: 1,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      });
      jest.spyOn(repositoryMock, 'create').mockReturnValue(createdProject);
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(createdProject);

      const result = await projectsService.create(projectToCreate);

      expect(result).toEqual(createdProject);
      expect(repositoryMock.create).toHaveBeenCalledWith(projectToCreate);
      expect(repositoryMock.save).toHaveBeenCalledWith(createdProject);
    });
  });

  describe('findById', () => {
    it('should find a project by id', async () => {
      const project = {
        name: 'Puerto Rico Island Wide',
        slug: 'puerto-rico-island-wide',
        summary: 'Acoustic monitoring and occupancy maps for...',
        siteCount: 940,
        speciesCount: 96,
        highlightedSpecies: [
          { code: 'amavi', name: 'Amazona vittata', status: 'CR' },
          { code: 'agexa', name: 'Agelaius xanthomus', status: 'EN' },
        ],
      } as Project;
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(project);

      const result = await projectsService.findById(1);

      expect(result).toEqual(project);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return undefined for non-existing id', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(undefined);

      const result = await projectsService.findById(999);

      expect(result).toBeUndefined();
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('update', () => {
    it('should update an existing project', async () => {
      const projectToUpdate = {
        name: 'Puerto Rico Island Wide',
        slug: 'puerto-rico-island-wide',
        summary: 'Acoustic monitoring and occupancy maps for...',
        siteCount: 940,
        speciesCount: 96,
        highlightedSpecies: [
          { code: 'amavi', name: 'Amazona vittata', status: 'CR' } as Species,
          {
            code: 'agexa',
            name: 'Agelaius xanthomus',
            status: 'EN',
          } as Species,
        ],
      } as Project;
      const updatePatch = {
        name: 'Updated name',
      } as Partial<Project>;
      const updatedProject = {
        name: 'Updated name',
        slug: 'puerto-rico-island-wide',
        summary: 'Acoustic monitoring and occupancy maps for...',
        siteCount: 940,
        speciesCount: 96,
        highlightedSpecies: [
          { code: 'amavi', name: 'Amazona vittata', status: 'CR' } as Species,
          {
            code: 'agexa',
            name: 'Agelaius xanthomus',
            status: 'EN',
          } as Species,
        ],
      } as Project;
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(projectToUpdate);
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(updatedProject);

      const result = await projectsService.update(1, updatePatch);

      expect(result.name).toEqual('Updated name');
      expect(result).toEqual(updatedProject);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repositoryMock.save).toHaveBeenCalledWith(projectToUpdate);
    });

    it(`should throw an error if project doesn't exist`, async () => {
      const updatePatch = {
        name: 'Updated name',
      } as Partial<Project>;
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(undefined);

      try {
        await projectsService.update(999, updatePatch);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
