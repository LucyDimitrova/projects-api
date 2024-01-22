import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { SpeciesStatus } from '../enums/Species';

export class CreateSpeciesDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Species code is required.' })
  @IsString({ message: 'Invalid code format - code should be string.' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Species name is required.' })
  @IsString({ message: 'Invalid species name format - name should be string.' })
  name: string;

  @ApiProperty({
    enum: SpeciesStatus,
    enumName: 'SpeciesStatus',
  })
  @IsEnum(SpeciesStatus, {
    message: 'Please provide a valid conservation status code.',
  })
  @IsNotEmpty({ message: 'Species status is required.' })
  status: string;
}
