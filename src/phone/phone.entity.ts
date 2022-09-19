import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Location } from '../location/location.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Phone {
  @PrimaryKey()
  id: number;

  @Property()
  number: string;

  @Property()
  name: string;

  @ManyToOne({ entity: () => Tag, eager: true, nullable: true })
  tag?: Tag;

  @ManyToOne({ entity: () => Location, eager: true, nullable: true })
  location?: Location;
}
