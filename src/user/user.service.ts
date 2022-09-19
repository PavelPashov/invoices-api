import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import EntityNotFoundException from 'src/common/exceptions/EntityNotFound.exception';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      id,
    });
    if (!user) {
      throw new EntityNotFoundException('User');
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      email,
    });
    if (!user) {
      throw new EntityNotFoundException('User');
    }
    return user;
  }
}
