import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Matches } from 'class-validator';

class CreatePhoneDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^359\d{9}$/)
  number: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  tag?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  location?: number;
}
export default CreatePhoneDto;
