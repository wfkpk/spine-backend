import { IsNotEmpty, IsString, IsInt, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  bookUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bookTitleBare: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  numPages: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  avgRating: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  ratingsCount: number;

  @ApiProperty()
  @IsUrl()
  kcrPreviewUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  goodReadsId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  authorId: string;
}
