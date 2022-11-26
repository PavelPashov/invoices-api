import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Matches } from 'class-validator';

class UpdatePhoneDto {
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @Matches(/^359\d{9}$/)
  number?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  tag?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  location?: number;
}

export default UpdatePhoneDto;
