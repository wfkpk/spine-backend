import {
  IsEnum,
  IsOptional,
  IsInt,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  READ = 'READ',
  WANT_TO_READ = 'WANT_TO_READ',
  CURRENTLY_READING = 'CURRENTLY_READING',
}
export class CreateStatusDto {
  @ApiProperty()
  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  progress: number;

  @ApiProperty()
  @IsOptional()
  @MaxLength(5)
  @MinLength(1)
  rating: number;
}
