import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

class FindOneParamDto {
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  id: string;
}
export default FindOneParamDto;
