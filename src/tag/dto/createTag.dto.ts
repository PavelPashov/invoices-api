import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
export default CreateTagDto;
