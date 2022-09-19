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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import FindOneParamDto from 'src/common/dto/findOneParam.dto';
import CreateLocationDto from './dto/createLocation.dto';
import { LocationService } from './location.service';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async findOne(@Param() { id }: FindOneParamDto) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async update(
    @Param() { id }: FindOneParamDto,
    @Body() body: CreateLocationDto,
  ) {
    return this.locationService.update(+id, body);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() body: CreateLocationDto) {
    return this.locationService.create(body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  async delete(@Param() { id }: FindOneParamDto) {
    return this.locationService.delete(+id);
  }
}
