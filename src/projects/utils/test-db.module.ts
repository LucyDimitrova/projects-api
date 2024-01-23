import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from '../entities/project.entity';
import { Species } from '../entities/species.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: ':memory:',
        entities: [Project, Species],
        synchronize: true,
      }),
    }),
  ],
})
export class TestDbModule {}
