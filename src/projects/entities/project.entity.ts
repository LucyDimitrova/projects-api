import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Species } from './species.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  summary: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  siteCount: number;

  @Column()
  speciesCount: number;

  @ManyToMany(() => Species, { cascade: true })
  @JoinTable({
    name: 'projects_highlighted_species',
  })
  highlightedSpecies: Species[];
}
