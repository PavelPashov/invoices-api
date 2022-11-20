import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import EntityNotFoundException from 'src/common/exceptions/EntityNotFound.exception';
import CreateTagDto from './dto/createTag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.findAll({ populate: ["numbers"] });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      id,
    });
    if (!tag) {
      throw new EntityNotFoundException('Tag');
    }
    return tag;
  }

  async create(data: CreateTagDto): Promise<Tag> {
    const newTag = await this.tagRepository.create(data);
    await this.tagRepository.persistAndFlush(newTag);
    return newTag;
  }

  async update(id: number, data: CreateTagDto): Promise<Tag> {
    const existingTag = await this.findOne(id);
    wrap(existingTag).assign(data);
    await this.tagRepository.persistAndFlush(existingTag);
    return existingTag;
  }

  async delete(id: number): Promise<Tag> {
    const tag = await this.findOne(id);
    this.tagRepository.removeAndFlush(tag);
    return tag;
  }
}
