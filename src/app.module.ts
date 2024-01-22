import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProjectsModule } from './projects/projects.module';
import { ProjectsController } from './projects/projects.controller';
import { Project } from './projects/entities/project.entity';
import { Species } from './projects/entities/species.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'local.db',
      // not recommended in production
      synchronize: true,
      entities: [Project, Species],
    }),
    ProjectsModule,
  ],
  controllers: [AppController, ProjectsController],
  providers: [AppService],
})
export class AppModule {}
