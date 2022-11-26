import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import FindOneParamDto from 'src/common/dto/findOneParam.dto';
import CreatePhoneDto from './dto/createPhone.dto';
import UpdatePhoneDto from './dto/updatePhone.dto';
import { PhoneService } from './phone.service';

@ApiTags('Phone')
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  findAll() {
    const phones = this.phoneService.findAll();
    return phones;
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async findOne(@Param() { id }: FindOneParamDto) {
    return this.phoneService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async update(@Param() { id }: FindOneParamDto, @Body() body: UpdatePhoneDto) {
    return this.phoneService.update(+id, body);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() body: CreatePhoneDto) {
    return this.phoneService.create(body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async delete(@Param() { id }: FindOneParamDto) {
    return this.phoneService.delete(+id);
  }

  @Post('invoice')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async parseInvoiceZip(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    const { user } = req;
    return this.phoneService.handleZipUpload(file, user);
  }
}
