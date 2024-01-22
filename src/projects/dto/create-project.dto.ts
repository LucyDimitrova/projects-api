import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

import { CreateSpeciesDto } from './species';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Project name is required.' })
  @IsString({ message: 'Invalid name format - name should be string.' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Project slug is required.' })
  @IsString({ message: 'Invalid slug format - slug should be string.' })
  slug: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please provide a short summary of the project.' })
  @MinLength(10, { message: 'Summary should be at least 10 symbols long.' })
  summary: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Site count should be a number.' })
  siteCount: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Species count should be a number.' })
  speciesCount: number;

  @ApiProperty({
    type: [CreateSpeciesDto],
  })
  @IsArray()
  highlightedSpecies: CreateSpeciesDto[];
}
