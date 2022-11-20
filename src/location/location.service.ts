import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Location } from './location.entity';
import EntityNotFoundException from 'src/common/exceptions/EntityNotFound.exception';
import CreateLocationDto from './dto/createLocation.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: EntityRepository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.locationRepository.findAll({populate: ["numbers"]});
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      id,
    });
    if (!location) {
      throw new EntityNotFoundException('Location');
    }
    return location;
  }

  async create(data: CreateLocationDto): Promise<Location> {
    const newLocation = await this.locationRepository.create(data);
    await this.locationRepository.persistAndFlush(newLocation);
    return newLocation;
  }

  async update(id: number, data: CreateLocationDto): Promise<Location> {
    const existingLocation = await this.findOne(id);
    wrap(existingLocation).assign(data);
    await this.locationRepository.persistAndFlush(existingLocation);
    return existingLocation;
  }

  async delete(id: number): Promise<Location> {
    const location = await this.findOne(id);
    this.locationRepository.removeAndFlush(location);
    return location;
  }
}
