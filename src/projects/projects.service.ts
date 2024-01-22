import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  async findAll(query?: Record<string, any>): Promise<Project[]> {
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
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const project = this.projectRepository.create(createProjectDto);
      return await this.projectRepository.save(project);
    } catch (e) {
      // TODO: refactor with Logger service
      console.error('Error creating project: ', e);
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const project = await this.projectRepository.findOne({ where: { id: id } });
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      return project;
    } catch (e) {
      // TODO: refactor with Logger service
      console.error(`Error fetching project with ID ${id}: `, e);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.findOne(id);
      Object.assign(project, updateProjectDto);
      return await this.projectRepository.save(project);
    } catch (e) {
      // TODO: refactor with Logger service
      console.error(`Error updating project with ID ${id}: `, e);
    }
  }
}
