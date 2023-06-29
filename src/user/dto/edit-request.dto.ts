import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  bookName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bookDescription: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  authorName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  genre: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
