import {
  Entity,
  Property,
  PrimaryKey,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { Phone } from '../phone/phone.entity';

@Entity()
export class Tag {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @OneToMany(() => Phone, (phone: Phone) => phone.tag, {
    eager: true,
  })
  numbers = new Collection<Phone>(this);
}
