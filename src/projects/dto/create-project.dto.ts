import { SpeciesDto } from './species';

export class CreateProjectDto {
  id: number;
  name: string;
  slug: string;
  summary: string;
  siteCount: number;
  speciesCount: number;
  highlightedSpecies: SpeciesDto[];
}
