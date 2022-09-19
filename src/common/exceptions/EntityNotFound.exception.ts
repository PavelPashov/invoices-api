import { NotFoundException } from '@nestjs/common';

class EntityNotFoundException extends NotFoundException {
  constructor(entity: string) {
    super(`${entity} not found`);
  }
}

export default EntityNotFoundException;
