import { TagService } from './tag.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import CreateTagDto from './dto/createTag.dto';
import FindOneParamDto from 'src/common/dto/findOneParam.dto';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async findOne(@Param() { id }: FindOneParamDto) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async update(@Param() { id }: FindOneParamDto, @Body() body: CreateTagDto) {
    return this.tagService.update(+id, body);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() body: CreateTagDto) {
    return this.tagService.create(body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async delete(@Param() { id }: FindOneParamDto) {
    return this.tagService.delete(+id);
  }
}
