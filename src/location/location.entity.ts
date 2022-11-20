import {
  Entity,
  Property,
  PrimaryKey,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Phone } from '../phone/phone.entity';

@Entity()
export class Location {
  @ApiProperty()
  @PrimaryKey()
  id: number;

  @ApiProperty()
  @Property()
  name: string;

  @ApiProperty()
  @OneToMany(() => Phone, (phone: Phone) => phone.location)
  numbers = new Collection<Phone>(this);
}
