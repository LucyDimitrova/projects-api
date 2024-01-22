import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';

import { Project } from './project.entity';

@Entity('species')
export class Species {
  @Column()
  name: string;

  @PrimaryColumn()
  code: string;

  @Column()
  status: string;

  @ManyToMany(() => Project, (project) => project.highlightedSpecies)
  projects: Project[];
}
