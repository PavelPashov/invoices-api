import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import EntityNotFoundException from 'src/common/exceptions/EntityNotFound.exception';
import CreatePhoneDto from './dto/createPhone.dto';
import { Phone } from './phone.entity';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: EntityRepository<Phone>,
  ) {}

  async findAll(): Promise<Phone[]> {
    return this.phoneRepository.findAll();
  }

  async findOne(id: number): Promise<Phone> {
    const phone = await this.phoneRepository.findOne({
      id,
    });
    if (!phone) {
      throw new EntityNotFoundException('Phone');
    }
    return phone;
  }

  async create(data: CreatePhoneDto): Promise<Phone> {
    const newPhone = await this.phoneRepository.create(data);
    await this.phoneRepository.persistAndFlush(newPhone);
    return newPhone;
  }

  async update(id: number, data: CreatePhoneDto): Promise<Phone> {
    const existingPhone = await this.findOne(id);
    wrap(existingPhone).assign(data);
    await this.phoneRepository.persistAndFlush(existingPhone);
    return existingPhone;
  }

  async delete(id: number): Promise<Phone> {
    const phone = await this.findOne(id);
    this.phoneRepository.removeAndFlush(phone);
    return phone;
  }
}
