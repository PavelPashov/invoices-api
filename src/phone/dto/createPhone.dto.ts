import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class CreatePhoneDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
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
