import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class ProjectsQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  species?: string;
}
