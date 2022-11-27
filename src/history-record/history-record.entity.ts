import { Entity, Property, PrimaryKey, ManyToOne, types } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Phone } from '../phone/phone.entity';

@Entity()
export class HistoryRecord {
  @ApiProperty()
  @PrimaryKey()
  id: number;

  @ApiProperty()
  @ManyToOne({ entity: () => Phone, eager: true })
  phone: Phone;

  @ApiProperty()
  @Property()
  date: Date;

  @ApiProperty()
  @Property({ type: types.float })
  charge: string;
}
