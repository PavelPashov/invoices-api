import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
export default CreateLocationDto;
