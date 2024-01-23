import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectsQuery } from './queries/ProjectsQuery';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Fetches all projects with an optional query
   *
   * @param query
   */
  async findAll(query?: ProjectsQuery): Promise<Project[]> {
    // Query by species
    const { species } = query || {};
    return this.projectRepository.find({
      relations: {
        highlightedSpecies: true,
      },
      where: species
        ? {
            highlightedSpecies: {
              code: species,
            },
          }
        : {},
    });
  }

  /**
   * Creates a new project
   *
   * @param createProjectDto
   */
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  /**
   * Finds a project by ID
   *
   * @param id
   */
  async findById(id: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id },
    });
  }

  /**
   * Updates a project
   *
   * @param id
   * @param updateProjectDto
   */
  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  /**
   * Util method used for seeding a test database
   *
   * @param projects
   */
  async seedTestDatabase(projects: CreateProjectDto[]) {
    return Promise.all(
      projects.map(async (project) => {
        await this.create(project);
      }),
    );
  }
}
